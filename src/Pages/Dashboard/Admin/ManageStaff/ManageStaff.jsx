import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const [staffList, setStaffList] = useState([]);
  const [issuesList, setIssuesList] = useState([]); // Add issues list state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all staff AND issues
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [staffRes, issuesRes] = await Promise.all([
        axiosSecure.get("/staff"),
        axiosSecure.get("/issues?limit=100") // Get more issues for assignment
      ]);
      setStaffList(staffRes.data);
      setIssuesList(issuesRes.data.issues);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [axiosSecure]);

  // Add new staff (same as before)
  const handleAddStaff = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Staff",
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Name">' +
        '<input id="swal-email" class="swal2-input" placeholder="Email">' +
        '<input id="swal-phone" class="swal2-input" placeholder="Phone">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById("swal-name").value,
          email: document.getElementById("swal-email").value,
          phone: document.getElementById("swal-phone").value,
          password: document.getElementById("swal-password").value,
        };
      },
    });

    if (formValues) {
      try {
        await axiosSecure.post("/staff", formValues);
        fetchAllData();
        Swal.fire("Success", "Staff added successfully", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to add staff", "error");
      }
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/staff/${id}`);
        fetchAllData();
        Swal.fire("Deleted!", "Staff has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete staff", "error");
      }
    }
  };

  // Assign staff to an issue
  const handleAssignToIssue = async (staffId, staffName) => {
    // Filter unassigned issues
    const unassignedIssues = issuesList.filter(issue => !issue.assignedStaff);
    
    if (unassignedIssues.length === 0) {
      Swal.fire("No Issues", "No unassigned issues available", "info");
      return;
    }

    // Create options for select
    const issueOptions = unassignedIssues.map(issue => 
      `<option value="${issue._id}">${issue.title} (${issue.category})</option>`
    ).join('');

    const { value: issueId } = await Swal.fire({
      title: `Assign ${staffName} to Issue`,
      html: `
        <p class="text-left mb-2">Select an issue to assign:</p>
        <select id="issue-select" class="swal2-input">
          ${issueOptions}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Assign",
      preConfirm: () => {
        return document.getElementById("issue-select").value;
      }
    });

    if (issueId) {
      try {
        await axiosSecure.patch(`/issues/${issueId}/assign-staff`, { staffId });
        fetchAllData();
        Swal.fire("Assigned!", `${staffName} has been assigned to the issue.`, "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to assign staff", "error");
      }
    }
  };

  // View issues assigned to a staff
  const handleViewAssignedIssues = (staffId, staffName) => {
    const assignedIssues = issuesList.filter(issue => 
      issue.assignedStaff && issue.assignedStaff.staffId === staffId
    );
    
    if (assignedIssues.length === 0) {
      Swal.fire("No Assigned Issues", `${staffName} has no assigned issues.`, "info");
      return;
    }

    const issuesHTML = assignedIssues.map(issue => `
      <div class="text-left mb-2 p-2 border-b">
        <strong>${issue.title}</strong><br/>
        <small>Category: ${issue.category}</small><br/>
        <small>Status: ${issue.status}</small><br/>
        <small>Priority: ${issue.priority}</small>
      </div>
    `).join('');

    Swal.fire({
      title: `Issues Assigned to ${staffName}`,
      html: issuesHTML,
      width: 600
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading staff...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={handleAddStaff}
        >
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Total Staff</h3>
          <p className="text-3xl font-bold">{staffList.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800">Assigned Issues</h3>
          <p className="text-3xl font-bold">
            {issuesList.filter(issue => issue.assignedStaff).length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Unassigned Issues</h3>
          <p className="text-3xl font-bold">
            {issuesList.filter(issue => !issue.assignedStaff).length}
          </p>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {staffList.map((staff) => (
          <div
            key={staff._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{staff.name}</h3>
                <p className="text-gray-600 text-sm">{staff.email}</p>
                {staff.phone && <p className="text-gray-600 text-sm">{staff.phone}</p>}
              </div>
              <div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Staff
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
                onClick={() => handleAssignToIssue(staff._id, staff.name)}
              >
                Assign Issue
              </button>
              <button
                className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition"
                onClick={() => handleViewAssignedIssues(staff._id, staff.name)}
              >
                View Issues
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition"
                onClick={() => Swal.fire("Update feature coming soon")}
              >
                Update
              </button>
              <button
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
                onClick={() => handleDeleteStaff(staff._id, staff.name)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/table view */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                Email
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                Phone
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                Created
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.map((staff) => {
              const assignedCount = issuesList.filter(issue => 
                issue.assignedStaff && issue.assignedStaff.staffId === staff._id
              ).length;
              
              return (
                <tr
                  key={staff._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm text-gray-800">
                    <div>
                      <strong>{staff.name}</strong>
                      {assignedCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {assignedCount} issue(s)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{staff.email}</td>
                  <td className="p-3 text-sm text-gray-600">{staff.phone || "N/A"}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(staff.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => handleAssignToIssue(staff._id, staff.name)}
                      >
                        Assign Issue
                      </button>
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => handleViewAssignedIssues(staff._id, staff.name)}
                      >
                        View Issues
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => Swal.fire("Update feature coming soon")}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => handleDeleteStaff(staff._id, staff.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {staffList.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          No staff found.
        </div>
      )}
    </div>
  );
};

export default ManageStaff;