import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const StaffProfile = () => {
  const { user } = useContext(AuthContext); 
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;

 
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      try {
        const res = await axiosSecure.get(`/staff/email/${encodeURIComponent(user.email)}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch staff profile:", err);
        alert("Failed to load profile. Please try again later.");
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


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        formData
      );
      if (res.data.success) {
        setProfile((prev) => ({ ...prev, photo: res.data.data.url }));
        alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };


  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await axiosSecure.patch(`/staff/profile/${profile._id}`, {
        name: profile.name,
        phone: profile.phone,
        photo: profile.photo,
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6">Profile not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
 
        <div className="flex items-center mb-6 gap-4">
          <img
            src={profile.photo || "https://i.ibb.co/2kR8f9p/user.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
          />
          <div>
            <p className="text-sm text-gray-500 mb-1">Staff Member</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

   
        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              value={profile.email}
              readOnly
              className="mt-1 w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>

          
        </div>

 
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
