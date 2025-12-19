import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Resolved: "bg-green-100 text-green-800",
    Closed: "bg-gray-200 text-gray-800",
    Working: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Pending: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const StaffAssignedIssues = () => {
  const { user } = useContext(AuthContext);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [staffId, setStaffId] = useState(null);

  const axiosSecure = useAxiosSecure();

  // Define allowed status transitions
  const statusTransitions = {
    Pending: ["In Progress"],
    "In Progress": ["Working"],
    Working: ["Resolved"],
    Resolved: ["Closed"],
  };

  // Fetch staff ID first
  useEffect(() => {
    const fetchStaffId = async () => {
      if (!user?.email) return;
      
      try {
        const response = await axiosSecure.get(`/staff/email/${encodeURIComponent(user.email)}`);
        if (response.data && response.data._id) {
          setStaffId(response.data._id);
        }
      } catch (err) {
        console.error("Error fetching staff ID:", err);
      }
    };

    fetchStaffId();
  }, [user?.email, axiosSecure]);

  // Fetch assigned issues using staff ID
  const fetchAssignedIssues = async () => {
    try {
      if (!staffId) return;

      const response = await axiosSecure.get(`/issues/assigned/staff/${staffId}/all`, {
        params: {
          status: filterStatus === "All" ? null : filterStatus,
          priority: filterPriority === "All" ? null : filterPriority,
        }
      });

      // The backend already sorts boosted issues first
      setAssignedIssues(response.data.issues || []);
    } catch (err) {
      console.error("Error fetching assigned issues:", err);
      // Fallback to email-based endpoint if needed
      if (user?.email) {
        try {
          const fallbackResponse = await axiosSecure.get(
            `/issues/assigned/email/${encodeURIComponent(user.email)}`
          );
          const issues = fallbackResponse.data.issues || [];
          // Manually sort boosted issues first for fallback
          issues.sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));
          setAssignedIssues(issues);
        } catch (fallbackErr) {
          console.error("Fallback fetch also failed:", fallbackErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchAssignedIssues();
    }
  }, [staffId, filterStatus, filterPriority]);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      // First, show loading
      Swal.fire({
        title: 'Updating Status...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Update status in backend
      const response = await axiosSecure.patch(`/issues/${issueId}/status`, {
        newStatus: newStatus,
        staffEmail: user.email,
        comment: `Status changed to ${newStatus}`
      });

      // Update UI with the response from backend
      setAssignedIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? response.data.issue : issue
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Issue status changed to "${newStatus}"`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      
      let errorMessage = "Could not update issue status";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });

      // Refresh the issues list
      fetchAssignedIssues();
    }
  };

  // Helper to get available next statuses
  const getNextAvailableStatuses = (currentStatus) => {
    const allowed = statusTransitions[currentStatus] || [];
    
    // For Working status, also allow going back to In Progress for corrections
    if (currentStatus === "Working") {
      return ["In Progress", "Resolved"];
    }
    
    // For Resolved status, also allow going back to Working for corrections
    if (currentStatus === "Resolved") {
      return ["Working", "Closed"];
    }
    
    return allowed;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-600">No staff logged in.</p>
      </div>
    );
  }

  // Apply frontend filters as backup (backend should already filter)
  const filteredIssues = assignedIssues.filter((issue) => {
    const statusMatch = filterStatus === "All" || issue.status === filterStatus;
    const priorityMatch = filterPriority === "All" || issue.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assigned Issues</h1>
          <p className="text-gray-600">
            Manage and update the status of issues assigned to you
          </p>
        </div>

    

      

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr
                      key={issue._id}
                      className={`hover:bg-gray-50 ${issue.boosted ? 'bg-yellow-50 hover:bg-yellow-100' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {issue.title}
                              </h3>
                              {issue.boosted && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Boosted
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {issue.description}
                            </p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {issue.category || "General"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={issue.status} />
                          {issue.assignedStaff && (
                            <span className="text-xs text-gray-500">
                              Assigned to: {issue.assignedStaff.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          issue.priority === 'High' || issue.priority === 'Critical' 
                            ? 'bg-red-100 text-red-800'
                            : issue.priority === 'Medium'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(issue.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                            value=""
                            disabled={!getNextAvailableStatuses(issue.status).length}
                          >
                            <option value="" disabled>
                              {getNextAvailableStatuses(issue.status).length 
                                ? "Change Status" 
                                : "No actions available"}
                            </option>
                            {getNextAvailableStatuses(issue.status).map((status) => (
                              <option key={status} value={status}>
                                Mark as {status}
                              </option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => {
                              
                              Swal.fire({
                                title: issue.title,
                                html: `
                                  <div class="text-left">
                                    <p><strong>Description:</strong> ${issue.description}</p>
                                    <p><strong>Category:</strong> ${issue.category}</p>
                                    <p><strong>Location:</strong> ${issue.location || 'Not specified'}</p>
                                    <p><strong>Reported by:</strong> ${issue.createdBy?.userName || 'Unknown'}</p>
                                    <p><strong>Created:</strong> ${formatDate(issue.createdAt)}</p>
                                  </div>
                                `,
                                showConfirmButton: true,
                                confirmButtonText: 'Close'
                              });
                            }}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium">No issues found</h3>
                        <p className="mt-1 text-sm">
                          {filterStatus !== "All" || filterPriority !== "All"
                            ? "Try changing your filters"
                            : "No issues are currently assigned to you"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

  
     
      </div>
    </div>
  );
};

export default StaffAssignedIssues;