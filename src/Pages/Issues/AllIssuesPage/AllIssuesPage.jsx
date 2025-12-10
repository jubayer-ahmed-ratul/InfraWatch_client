import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import allIssuesData from "../../../../public/allIssues.json";

export default function AllIssuesPage({ currentUser }) {
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIssues(allIssuesData);
  }, []);

  const handleUpvote = (issueId) => {
    const issue = issues.find((i) => i.id === issueId);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (issue.createdBy.userId === currentUser.userId) return;
    if (issue.userUpvoted?.includes(currentUser.userId)) return;

    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? {
              ...i,
              upvotes: i.upvotes + 1,
              userUpvoted: [...(i.userUpvoted || []), currentUser.userId],
            }
          : i
      )
    );
  };

  const filteredIssues = issues
    .filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((issue) => !categoryFilter || issue.category === categoryFilter)
    .filter((issue) => !statusFilter || issue.status === statusFilter)
    .filter((issue) => !priorityFilter || issue.priority === priorityFilter)
    .sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-11/12 mx-auto ">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All <span className="text-green-600">Issues</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore reported issues and support the ones that matter most
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
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
            <option value="Completed">Completed</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIssues.map((issue) => {
            const canUpvote =
              currentUser &&
              currentUser.userId !== issue.createdBy.userId &&
              !(issue.userUpvoted?.includes(currentUser.userId) ?? false);

            return (
              <div
                key={issue.id}
                className={`bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition ${
                  issue.boosted ? "ring-2 ring-yellow-400" : ""
                }`}
              >
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

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200">
                      {issue.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.status === "Completed"
                          ? "bg-green-500 text-white"
                          : issue.status === "In-Progress"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {issue.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.priority === "High"
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    Location: {issue.location}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Upvotes: {issue.upvotes}
                  </p>

                  <div className="flex  gap-2">
                    <button
                      onClick={() => handleUpvote(issue.id)}
                      disabled={!canUpvote}
                      className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                        canUpvote
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Upvote ({issue.upvotes})
                    </button>
                    <button
                      onClick={() => navigate(`/issues/${issue.id}`)}
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

        {filteredIssues.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No issues found.
          </div>
        )}
      </div>
    </section>
  );
}
