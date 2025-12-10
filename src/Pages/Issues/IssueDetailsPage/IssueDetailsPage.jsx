import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import allIssuesData from "../../../../public/allIssues.json";

export default function IssueDetailsPage({ currentUser }) {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    const foundIssue = allIssuesData.find((i) => i.id === issueId);
    setIssue(foundIssue);
  }, [issueId]);

  if (!issue) {
    return (
      <div className="text-center py-20 text-gray-500">Issue not found.</div>
    );
  }

  const isCreator = currentUser?.userId === issue.createdBy?.userId;
  const canEdit = isCreator && issue.status === "Pending";
  const canDelete = isCreator;
  const canBoost = !issue.boosted;

  const handleEdit = () => alert("Edit functionality coming soon!");
  const handleDelete = () => alert("Delete functionality coming soon!");
  const handleBoost = () => {
    alert("Payment & boost functionality coming soon!");
    setIssue((prev) => ({ ...prev, boosted: true, priority: "High" }));
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-2/3 space-y-6">
            {issue.image ? (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-80 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No Image</span>
              </div>
            )}

            <h2 className="text-3xl font-bold">{issue.title}</h2>
            <p className="text-gray-700">{issue.description}</p>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-gray-200 text-sm font-semibold rounded-full">
                {issue.category}
              </span>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  issue.priority === "High"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {issue.priority}
              </span>
            </div>

            <p className="text-gray-500">Location: {issue.location}</p>
            <p className="text-gray-500">Upvotes: {issue.upvotes}</p>

            <div className="flex flex-wrap gap-3 mt-4">
              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
              {canBoost && (
                <button
                  onClick={handleBoost}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Boost Issue
                </button>
              )}
            </div>
          </div>

          <div className="md:w-1/3 space-y-6">
            {issue.assignedStaff && (
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-lg">Assigned Staff</h3>
                <p className="text-gray-700">{issue.assignedStaff.name}</p>
                <p className="text-gray-500">{issue.assignedStaff.contact}</p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4 text-lg">Issue Timeline</h3>
              <div className="space-y-6 relative">
                {(issue.timeline || [])
                  .slice(0)
                  .reverse()
                  .map((entry, idx) => (
                    <div key={idx} className="relative pl-6">
                      <span className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></span>
                      <span className="absolute left-1 top-0 h-full w-0.5 bg-blue-300"></span>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                      <p className="font-semibold">{entry.status}</p>
                      <p className="text-gray-600">{entry.message}</p>
                      <p className="text-gray-400 text-xs">By: {entry.updatedBy}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
