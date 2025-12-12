import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const MyIssuesPage = () => {
  const axiosSecure = useAxiosSecure();
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState({ status: '', category: '' });
  const [editModal, setEditModal] = useState({ open: false, issue: null });
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/issues?limit=1000'); 
        setIssues(res.data.issues || []);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to fetch issues', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [axiosSecure]);

  // Filtered issues
  const filteredIssues = issues.filter(issue => {
    return (
      (filter.status ? issue.status === filter.status : true) &&
      (filter.category ? issue.category === filter.category : true)
    );
  });

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this issue?');
    if (!confirmed) return;

    try {
      await axiosSecure.delete(`/issues/${id}`);
      setIssues(prev => prev.filter(issue => issue._id !== id));
      Swal.fire('Deleted!', 'Issue has been deleted', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Failed to delete issue';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedIssue = {
      ...editModal.issue,
      title: e.target.title.value,
      category: e.target.category.value,
      status: e.target.status.value,
      description: e.target.description.value,
    };

    try {
      await axiosSecure.patch(`/issues/${updatedIssue._id}`, updatedIssue);
      setIssues(prev => prev.map(issue => issue._id === updatedIssue._id ? updatedIssue : issue));
      setEditModal({ open: false, issue: null });
      Swal.fire('Success', 'Issue updated successfully', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Failed to update issue';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-700">Loading issues...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        My Issues ({filteredIssues.length.toString().padStart(2, '0')})
      </h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={filter.status}
          onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select
          value={filter.category}
          onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

   
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No issues found
                </td>
              </tr>
            ) : (
              filteredIssues.map(issue => (
                <tr key={issue._id}>
                  <td className="px-6 py-4 text-gray-900">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.category}</td>
                  <td className="px-6 py-4 text-gray-700">{issue.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    {issue.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => setEditModal({ open: true, issue })}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil />
                        </button>
                        <button
                          onClick={() => handleDelete(issue._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => alert('Navigate to issue details page')}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  defaultValue={editModal.issue.title}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editModal.issue.category}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="Bug">Bug</option>
                  <option value="Feature">Feature</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editModal.issue.status}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editModal.issue.description}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, issue: null })}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssuesPage;