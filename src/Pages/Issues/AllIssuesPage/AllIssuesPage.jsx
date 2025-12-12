import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../Home/Components/Loader/Loader";

export default function AllIssuesPage({ currentUser }) {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null); 
  const limit = 9;

 
  const { data, isFetching } = useQuery({
    queryKey: ["issues", { searchQuery, categoryFilter, statusFilter, priorityFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit,
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        priority: priorityFilter,
      });
      const res = await axiosSecure.get(`/issues?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const issues = data?.issues || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);


  const upvoteMutation = useMutation({
    mutationFn: async (issueId) => {
      const res = await axiosSecure.patch(`/issues/${issueId}/upvote`, {
        userId: currentUser.userId,
      });
      return res.data;
    },
    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: ["issues"] });
      const previousData = queryClient.getQueryData(["issues"]);

      queryClient.setQueryData(["issues"], (oldData) => ({
        ...oldData,
        issues: oldData.issues.map((i) =>
          i._id === issueId
            ? {
                ...i,
                upvotes: i.upvotes + 1,
                userUpvoted: [...(i.userUpvoted || []), currentUser.userId],
              }
            : i
        ),
      }));

      return { previousData };
    },
    onError: (_err, _issueId, context) => {
      queryClient.setQueryData(["issues"], context.previousData);
      setMessage("Failed to upvote. Please try again!");
      setTimeout(() => setMessage(null), 3000);
    },
    onSuccess: (_data) => {
      setMessage("Upvoted successfully!");
      setTimeout(() => setMessage(null), 3000);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  const handleUpvote = (issue) => {
    if (!currentUser) {
      setMessage("You must log in to upvote!");
      setTimeout(() => setMessage(null), 3000);
      return navigate("/login");
    }

    if (issue.createdBy.userId === currentUser.userId) {
      setMessage("You cannot upvote your own issue!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (issue.userUpvoted?.includes(currentUser.userId)) {
      setMessage("You have already upvoted this issue!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    upvoteMutation.mutate(issue._id);
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-11/12 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All <span className="text-green-600">Issues</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore reported issues and support the ones that matter most
          </p>
        </div>

       
        {message && (
          <div className="mb-4 text-center text-sm font-semibold text-white bg-green-500 px-4 py-2 rounded-md">
            {message}
          </div>
        )}

     
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm w-full md:w-64"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Categories</option>
            <option value="Footpath">Footpath</option>
            <option value="Road">Road</option>
            <option value="Streetlight">Streetlight</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        {isFetching && <Loader size="w-10 h-10" color="border-green-500" />}

    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {issues.map((issue) => {
            const canUpvote =
              currentUser &&
              currentUser.userId !== issue.createdBy.userId &&
              !(issue.userUpvoted?.includes(currentUser.userId) ?? false);

            return (
              <div
                key={issue._id}
                className={`bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition relative ${
                  issue.boosted ? "ring-2 ring-yellow-400" : ""
                }`}
              >
               
                {issue.boosted && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10">
                    BOOSTED
                  </span>
                )}

                {issue.image ? (
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    Location: {issue.location}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Upvotes: {issue.upvotes}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpvote(issue)}
                      disabled={!canUpvote || upvoteMutation.isLoading}
                      className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                        canUpvote
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Upvote ({issue.upvotes})
                    </button>
                    <button
                      onClick={() => navigate(`/issues/${issue._id}`)}
                      className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
