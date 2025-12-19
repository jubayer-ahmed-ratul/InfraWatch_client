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
    } catch {
      alert("Failed to make admin");
    }
  };


  const handleMakeStaff = async (user) => {
    try {
      await axiosSecure.post(`/staff/from-user/${user._id}`);
      alert(`${user.email} is now staff`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to make staff");
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      await axiosSecure.patch("/users/block", {
        email: user.email,
        blocked: !user.blocked,
      });
      fetchUsers();
      alert(`${user.email} is now ${user.blocked ? "unblocked" : "blocked"}`);
    } catch {
      alert("Failed to update block status");
    }
  };


  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      await axiosSecure.delete(`/users/${id}`);
      fetchUsers();
      alert(`${email} deleted`);
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

   
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded-lg p-4 shadow">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>

            <div className="mt-2 flex gap-2 flex-wrap">
              {user.role !== "admin" && (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleMakeAdmin(user.email)}
                >
                  Make Admin
                </button>
              )}

              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded"
                onClick={() => handleMakeStaff(user)}
              >
                Make Staff
              </button>

              <button
                className={`px-3 py-1 rounded text-white ${
                  user.blocked ? "bg-yellow-500" : "bg-red-500"
                }`}
                onClick={() => handleToggleBlock(user)}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>

              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => handleDeleteUser(user._id, user.email)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

     
      <div className="hidden md:block overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role || "user"}</td>
                <td className="p-3">
                  {user.blocked ? "Blocked" : "Active"}
                </td>
                <td className="p-3 flex gap-2 flex-wrap">
                 

                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded"
                    onClick={() => handleMakeStaff(user)}
                  >
                    Make Staff
                  </button>

                  <button
                    className={`px-3 py-1 rounded text-white ${
                      user.blocked ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    onClick={() => handleToggleBlock(user)}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteUser(user._id, user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No users found</p>
      )}
    </div>
  );
};

export default ManageUsers;
