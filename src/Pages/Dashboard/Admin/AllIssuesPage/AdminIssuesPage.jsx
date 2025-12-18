import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Search, UserPlus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminIssuesPage = () => {
  const axiosSecure = useAxiosSecure();
  const [issues, setIssues] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [filter, setFilter] = useState({ search: '', status: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive handle
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [issuesRes, staffRes] = await Promise.all([
          axiosSecure.get('/issues?limit=100'),
          axiosSecure.get('/staff')
        ]);
        setIssues(issuesRes.data.issues || []);
        setStaffList(staffRes.data || []);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to fetch data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = filter.search
      ? issue.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filter.search.toLowerCase())
      : true;
    const matchesStatus = filter.status ? issue.status === filter.status : true;
    const matchesCategory = filter.category ? issue.category === filter.category : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Assign staff
  const handleAssignStaff = async (issueId) => {
    if (staffList.length === 0) {
      Swal.fire('No Staff', 'Add staff members first', 'info');
      return;
    }

    const { value: staffId } = await Swal.fire({
      title: 'Assign Staff Member',
      input: 'select',
      inputOptions: staffList.reduce((opts, s) => ({ ...opts, [s._id]: `${s.name} (${s.email})` }), {}),
      showCancelButton: true,
      confirmButtonText: 'Assign',
      cancelButtonText: 'Cancel'
    });

    if (!staffId) return;

    try {
      const staff = staffList.find(s => s._id === staffId);
      await axiosSecure.patch(`/issues/${issueId}/assign-staff`, { staffId });
      setIssues(prev => prev.map(i => i._id === issueId ? { 
        ...i, 
        assignedStaff: { ...staff, staffId: staff._id },
        status: 'In Progress'
      } : i));
      Swal.fire('Assigned!', `${staff.name} assigned to issue`, 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to assign staff', 'error');
    }
  };

  // Delete issue
  const handleDelete = async (issueId, title) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete Issue?',
      text: `"${title}" will be permanently deleted`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/issues/${issueId}`);
      setIssues(prev => prev.filter(i => i._id !== issueId));
      Swal.fire('Deleted!', 'Issue removed successfully', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to delete issue', 'error');
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' };
      case 'in progress': return { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' };
      case 'resolved': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800' };
      default: return { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Issue Management</h1>
        <p className="text-gray-600 mt-1">Manage and assign reported issues to staff</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search issues..."
                value={filter.search}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sewage">Sewage</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Total Issues</p>
          <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Assigned Issues</p>
          <p className="text-2xl font-bold text-green-600">
            {issues.filter(i => i.assignedStaff).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Unassigned Issues</p>
          <p className="text-2xl font-bold text-yellow-600">
            {issues.filter(i => !i.assignedStaff).length}
          </p>
        </div>
      </div>

      {/* Issues List */}
      {isMobile ? (
        // Mobile View
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
              No issues found
            </div>
          ) : filteredIssues.map(issue => {
            const statusInfo = getStatusInfo(issue.status);
            return (
              <div key={issue._id} className="bg-white rounded-xl border p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{issue.status}</span>
                      </span>
                      <span className="text-sm text-gray-600">{issue.category}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  {issue.assignedStaff ? (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-green-800 text-sm font-bold">
                            {issue.assignedStaff.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Assigned to</p>
                          <p className="text-xs text-gray-600">{issue.assignedStaff.name}</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Assigned</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAssignStaff(issue._id)}
                      className="w-full mb-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Staff
                    </button>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleDelete(issue._id, issue.title)}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                    <a
                      href={`/issues/${issue._id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop View
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No issues found matching your filters
                    </td>
                  </tr>
                ) : filteredIssues.map(issue => {
                  const statusInfo = getStatusInfo(issue.status);
                  return (
                    <tr key={issue._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{issue.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {issue.description?.substring(0, 80) || 'No description'}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{issue.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{issue.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        {issue.assignedStaff ? (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-green-800 text-sm font-bold">
                                {issue.assignedStaff.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{issue.assignedStaff.name}</p>
                              <p className="text-xs text-green-600">Assigned</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {!issue.assignedStaff && (
                            <button
                              onClick={() => handleAssignStaff(issue._id)}
                              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Assign
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(issue._id, issue.title)}
                            className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
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
        </div>
      )}
    </div>
  );
};

export default AdminIssuesPage;