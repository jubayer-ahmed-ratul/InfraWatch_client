import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const StaffProfile = () => {
  const { user } = useContext(AuthContext); // Logged-in staff
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Technical Support", // static for now
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.email) return;

        const response = await axiosSecure.get(
          `/staff/assigned/email/${encodeURIComponent(user.email)}`
        );

        // Assuming response.data returns a single staff object
        const staffData = response.data.staff || response.data; 
        setProfile({
          name: staffData.name || "",
          email: staffData.email || "",
          phone: staffData.phone || "",
          department: "Technical Support",
        });
      } catch (err) {
        console.error("Failed to fetch staff profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Update only phone for now
      await axiosSecure.patch(`/staff/${user.dbId}`, { phone: profile.phone });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">No staff logged in.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">Staff Member</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={profile.department}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              readOnly
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
