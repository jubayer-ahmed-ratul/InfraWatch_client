import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Pencil, Trash2, Eye, Search } from "lucide-react";
import { Card } from "../Card/Card";

const MyIssuesPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState({ status: "", category: "", search: "" });
  const [editModal, setEditModal] = useState({ open: false, issue: null });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axiosSecure
      .get(`/issues/user/${user.email}?limit=1000`)
      .then((res) => setIssues(res.data.issues || []))
      .catch(() => {
        Swal.fire("Error", "Failed to fetch your issues", "error");
      })
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);


  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = filter.search
      ? issue.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        issue.description.toLowerCase().includes(filter.search.toLowerCase())
      : true;

    return (
      matchesSearch &&
      (filter.status ? issue.status === filter.status : true) &&
      (filter.category ? issue.category === filter.category : true)
    );
  });


  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "This issue will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it",
    });

    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/issues/${id}`);
      setIssues((prev) => prev.filter((i) => i._id !== id));
      Swal.fire("Deleted!", "Issue deleted successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to delete issue", "error");
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      title: e.target.title.value,
      category: e.target.category.value,
      description: e.target.description.value,
    };

    try {
      await axiosSecure.patch(
        `/issues/${editModal.issue._id}`,
        updatedData
      );
      setIssues((prev) =>
        prev.map((i) =>
          i._id === editModal.issue._id ? { ...i, ...updatedData } : i
        )
      );
      setEditModal({ open: false, issue: null });
      Swal.fire("Success", "Issue updated", "success");
    } catch {
      Swal.fire("Error", "Failed to update issue", "error");
    }
  };


  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Pending").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
  
      <h1 className="text-3xl font-bold mb-6">
        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Issues</span>
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Issues" value={stats.total} color="from-blue-500 to-cyan-500" />
        <Card title="Pending" value={stats.pending} color="from-yellow-500 to-orange-500" />
        <Card title="In Progress" value={stats.inProgress} color="from-purple-500 to-violet-600" />
        <Card title="Resolved" value={stats.resolved} color="from-green-500 to-emerald-600" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          placeholder="Search issues..."
          value={filter.search}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, search: e.target.value }))
          }
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Issue List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white p-4 rounded-xl border shadow-sm"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{issue.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {issue.category} • {issue.status}
                </p>
              </div>

              <div className="flex gap-2">
                {issue.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        setEditModal({ open: true, issue })
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(issue._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    (window.location.href = `/issues/${issue._id}`)
                  }
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {issue.description?.slice(0, 100)}...
            </p>
          </div>
        ))}
      </div>

     
      {editModal.open && (
        <div className="fixed top-20 right-4 z-50 w-full max-w-md">
          <div className="bg-white border rounded-xl shadow-2xl p-5">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">Edit Issue</h2>
              <button
                onClick={() => setEditModal({ open: false, issue: null })}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                name="title"
                defaultValue={editModal.issue.title}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <select
                name="category"
                defaultValue={editModal.issue.category}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>Road</option>
                <option>Electricity</option>
                <option>Water</option>
                <option>Sewage</option>
                <option>Public Safety</option>
                <option>Other</option>
              </select>

              <textarea
                name="description"
                defaultValue={editModal.issue.description}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({ open: false, issue: null })
                  }
                  className="px-3 py-1 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-green-600 text-white rounded-lg"
                >
                  Update
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
