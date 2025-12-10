import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LatestResolvedIssues() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/latest.json")
      .then((res) => res.json())
      .then((data) => {
        const resolvedIssues = data.issues.filter(issue => issue.status === "Resolved");
        const sorted = resolvedIssues.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setIssues(sorted.slice(0, 6)); 
      })
      .catch((err) => console.error("Error loading latest.json:", err));
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/issue/${id}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-11/12 mx-auto ">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recently <span className="text-green-600">Resolved</span> Issues
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See how community reports lead to real changes in our city infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map(issue => (
            <div key={issue.id} className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition">
              {issue.images && issue.images[0] ? (
                <img
                  src={issue.images[0]}
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
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{issue.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                    {issue.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    issue.priority === "High" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}>
                    {issue.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-3">Location: {issue.location}</p>
                <p className="text-sm text-gray-400 mb-4">Upvotes: {issue.upvotes}</p>

                <button
                  onClick={() => handleViewDetails(issue.id)}
                  className="w-full py-6 btn bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg text-[19px] transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No resolved issues found.
          </div>
        )}
      </div>
    </section>
  );
}
