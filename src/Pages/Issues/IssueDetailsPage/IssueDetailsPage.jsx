import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../Home/Components/Loader/Loader";
import PublicPageWrapper from "../../../components/PublicPageWrapper/PublicPageWrapper";

export default function IssueDetailsPage({ currentUser }) {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch issue details
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axiosSecure.get(`/issues/${issueId}`);
        console.log("Issue Data:", res.data); // ডিবাগিং এর জন্য
        console.log("Current User:", currentUser); // ডিবাগিং এর জন্য
        setIssue(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch issue.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [issueId, axiosSecure]);

  if (loading) return <Loader size="w-16 h-16" color="border-green-500" />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!issue) return <div className="text-center py-20 text-gray-500">Issue not found.</div>;

  // **সংশোধিত isCreator লজিক**
  // সবচেয়ে কার্যকরী উপায় - ইমেইল বেসড কম্প্যারিসন
  const isCreator = currentUser?.email === issue.createdBy?.email;
  
  // **ডিবাগিং এর জন্য কনসোলে লগ করুন**
  console.log("isCreator Check:", {
    currentUserEmail: currentUser?.email,
    issueCreatedByEmail: issue.createdBy?.email,
    isCreator: isCreator
  });

  const canEdit = isCreator && issue.status === "Pending";
  const canDelete = isCreator;
  const canBoost = !issue.boosted && isCreator; // শুধুমাত্র ক্রিয়েটরই বুস্ট দিতে পারবে

  // Actions
  const handleEdit = () => navigate(`/issues/edit/${issue._id}`);
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axiosSecure.delete(`/issues/${issue._id}`);
      alert("Issue deleted successfully.");
      navigate("/my-issues");
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue.");
    }
  };
  const handleBoost = async () => {
    try {
      const res = await axiosSecure.post(`/issues/${issue._id}/boost-session`, {
        userEmail: currentUser?.email,
      });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Failed to start boost payment.");
    }
  };

  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-500 text-white";
      case "In-Progress": return "bg-blue-500 text-white";
      default: return "bg-yellow-500 text-white";
    }
  };

  return (
    <PublicPageWrapper>
      <section className="py-16 bg-base-200 min-h-screen">
        <div className="max-w-6xl mx-auto bg-base-100 shadow-lg rounded-xl overflow-hidden p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Column */}
          <div className="md:w-2/3 space-y-6">
            {/* Issue Image */}
            {issue.image ? (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-80 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-full h-80 bg-base-200 flex items-center justify-center rounded-lg">
                <span className="text-base-content/50">No Image</span>
              </div>
            )}

            {/* Issue Info */}
            <h2 className="text-3xl font-bold">{issue.title}</h2>
            <p className="text-base-content/70">{issue.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-base-200 text-sm font-semibold rounded-full">{issue.category}</span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${issue.priority === "High" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
                {issue.priority}
              </span>
            </div>

            <p className="text-base-content/60">Location: {issue.location}</p>
            <p className="text-base-content/60">Upvotes: {issue.upvotes}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {canEdit && (
                <button 
                  onClick={handleEdit} 
                  className="px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={handleDelete} 
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
              {canBoost && (
                <button 
                  onClick={handleBoost} 
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Boost Issue
                </button>
              )}
            </div>

            
          </div>

     
          <div className="md:w-1/3 space-y-6">
       
            {issue.assignedStaff && (
              <div className="p-4 bg-base-200 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 text-lg">Assigned Staff</h3>
                <p className="text-base-content/70">{issue.assignedStaff.name}</p>
                <p className="text-base-content/60">{issue.assignedStaff.contact}</p>
              </div>
            )}

       
            <div className="p-4 bg-base-200 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4 text-lg">Issue Timeline</h3>
              <div className="space-y-6 relative">
                {(issue.timeline || []).slice(0).reverse().map((entry, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="absolute left-1 top-0 h-full w-0.5 bg-blue-300"></span>
                    <p className="text-sm text-base-content/60">{entry.date}</p>
                    <p className="font-semibold">{entry.status}</p>
                    <p className="text-base-content/70">{entry.message}</p>
                    <p className="text-base-content/50 text-xs">By: {entry.updatedBy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </PublicPageWrapper>
  );
}