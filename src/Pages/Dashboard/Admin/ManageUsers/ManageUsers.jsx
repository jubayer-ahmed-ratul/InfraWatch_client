import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [axiosSecure]);


  const handleMakeAdmin = async (email) => {
    try {
      await axiosSecure.patch("/users/make-admin", { email });
      fetchUsers();
      alert(`${email} is now an admin`);
    } catch (err) {
      console.error(err);
      alert("Failed to make admin");
    }
  };


  const handleToggleBlock = async (user) => {
    try {
      await axiosSecure.patch("/users/block", { email: user.email, blocked: !user.blocked });
      fetchUsers();
      alert(`${user.email} is now ${user.blocked ? "unblocked" : "blocked"}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update block status");
    }
  };


  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      await axiosSecure.delete(`/users/${id}`);
      fetchUsers();
      alert(`${email} deleted`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg">Loading users...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500 text-lg">Error: {error}</p></div>;

  return (
    <div className="p-4 md:p-6">
   <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manage{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
            Users
            </span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage all users information
          </p>
        </div>
      
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role || "user"}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.premium ? "Premium" : "Regular"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex flex-col gap-2">
                  {user.role !== "admin" && (
                    <button
                      className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      onClick={() => handleMakeAdmin(user.email)}
                    >
                      Make Admin
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`w-full px-3 py-2 rounded-lg text-white hover:opacity-90 transition-colors text-sm font-medium ${user.blocked ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"}`}
                      onClick={() => handleToggleBlock(user)}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="w-full bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                      onClick={() => handleDeleteUser(user._id, user.email)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Role</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Premium</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Joined</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm text-gray-800">{user.name}</td>
                <td className="p-3 text-sm text-gray-600">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.premium ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {user.role !== "admin" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => handleMakeAdmin(user.email)}
                      >
                        Make Admin
                      </button>
                    )}
                    <button
                      className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${user.blocked ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"}`}
                      onClick={() => handleToggleBlock(user)}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => handleDeleteUser(user._id, user.email)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;