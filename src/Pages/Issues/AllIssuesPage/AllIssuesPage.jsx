import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../Home/Components/Loader/Loader";
import PublicPageWrapper from "../../../components/PublicPageWrapper/PublicPageWrapper";

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

  // ✅ ONE SOURCE OF TRUTH FOR QUERY KEY
  const issuesQueryKey = [
    "issues",
    searchQuery,
    categoryFilter,
    statusFilter,
    priorityFilter,
    page,
  ];

  // =========================
  // FETCH ISSUES
  // =========================
  const { data, isFetching } = useQuery({
    queryKey: issuesQueryKey,
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

  // =========================
  // UPVOTE MUTATION
  // =========================
  const upvoteMutation = useMutation({
    mutationFn: async (issueId) => {
      return axiosSecure.patch(`/issues/${issueId}/upvote`, {
        userId: currentUser?.userId,
      });
    },

    onMutate: async (issueId) => {
      await queryClient.cancelQueries({ queryKey: issuesQueryKey });
      const previousData = queryClient.getQueryData(issuesQueryKey);

      queryClient.setQueryData(issuesQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          issues: oldData.issues.map((issue) =>
            issue._id === issueId
              ? {
                  ...issue,
                  upvotes: issue.upvotes + 1,
                  userUpvoted: [
                    ...(issue.userUpvoted || []),
                    currentUser.userId,
                  ],
                }
              : issue
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _issueId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          issuesQueryKey,
          context.previousData
        );
      }
      setMessage("Failed to upvote. Please try again!");
      setTimeout(() => setMessage(null), 3000);
    },

    onSuccess: () => {
      setMessage("Upvoted successfully!");
      setTimeout(() => setMessage(null), 3000);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  // =========================
  // HANDLE UPVOTE
  // =========================
  const handleUpvote = (issue) => {
    if (!currentUser) {
      setMessage("You must log in to upvote!");
      setTimeout(() => setMessage(null), 3000);
      return navigate("/login");
    }

    if (issue?.createdBy?.userId === currentUser.userId) {
      setMessage("You cannot upvote your own issue!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (issue?.userUpvoted?.includes(currentUser.userId)) {
      setMessage("You have already upvoted this issue!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    upvoteMutation.mutate(issue._id);
  };

  // =========================
  // UI
  // =========================
  return (
    <PublicPageWrapper>
      <section className="py-16 bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            All <span className="text-green-600">Issues</span>
          </h2>
          <p className="text-base-content/70">
            Explore reported issues and support public priorities
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-4 text-center text-white bg-green-500 py-2 rounded">
            {message}
          </div>
        )}

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border w-full md:w-64"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border bg-base-100"
          >
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Footpath">Footpath</option>
            <option value="Street Light">Street Light</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border bg-base-100"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border bg-base-100"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        {/* LOADER */}
        {isFetching && <Loader />}

        {/* ISSUES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => {
            const canUpvote =
              currentUser &&
              issue?.createdBy?.userId !== currentUser.userId &&
              !issue?.userUpvoted?.includes(currentUser.userId);

            return (
              <div
                key={issue._id}
                className={`bg-base-100 rounded-lg shadow p-4 relative ${
                  issue.boosted ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                {issue.boosted && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                    BOOSTED
                  </span>
                )}

                <img
                  src={issue.image || "https://via.placeholder.com/400"}
                  alt={issue.title}
                  className="h-48 w-full object-cover rounded mb-3"
                />

                <h3 className="font-semibold text-lg mb-1">
                  {issue.title}
                </h3>
                <p className="text-sm text-base-content/60 mb-2">
                  {issue.description}
                </p>
                <p className="text-sm text-base-content/50">
                  Location: {issue.location}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={!canUpvote || upvoteMutation.isLoading}
                    onClick={() => handleUpvote(issue)}
                    className={`flex-1 py-2 rounded text-white ${
                      canUpvote
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Upvote ({issue.upvotes})
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/issues/${issue._id}`)
                    }
                    className="flex-1 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-base-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            {page} / {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={page === totalPages}
            className="px-4 py-2 bg-base-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
    </PublicPageWrapper>
  );
}
