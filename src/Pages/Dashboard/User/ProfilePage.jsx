import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProfilePage = () => {
  const { user, updateUserProfile, logOut } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;

  const fetchUser = async () => {
    try {
      const { data } = await axiosSecure.get(`/users/${user.email}`);
      setName(data.displayName || "");
      setPhoto(data.photoURL || "");
      if (updateUserProfile) {
        updateUserProfile(data.displayName, data.photoURL, data.isPremium);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      fetchUser();
      alert("Payment successful! Premium status updated.");
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(name, photo);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        formData
      );
      if (data.success) {
        setPhoto(data.data.url);
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setSubscribing(true);
      const { data } = await axiosSecure.post("/create-checkout-session", {
        userEmail: user.email,
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setSubscribing(false);
    }
  };

  if (!user) return <p className="text-center mt-10">No user logged in</p>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-base-200">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Profile{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Settings
            </span>
          </h1>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">
            Manage your account information
          </p>
        </div>

        <div className="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
   
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
              <div className="relative">
                <img
                  src={photo || "https://i.ibb.co/2kR8f9p/user.png"}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-green-500"
                />
                {user.isPremium && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {user.displayName || "No Name"}
                </h2>
                <p className="text-base-content/70 text-sm sm:text-base">{user.email}</p>
                {user.isBlocked ? (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    Blocked
                  </span>
                ) : user.isPremium ? (
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Premium User
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    Free User
                  </span>
                )}
              </div>
            </div>

   
            {user.isBlocked && (
              <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠</span>
                  <div>
                    <p className="text-red-700 font-medium">Account Blocked</p>
                    <p className="text-red-600 text-sm mt-1">
                      You are currently blocked from reporting issues. Please
                      contact support.
                    </p>
                  </div>
                </div>
              </div>
            )}

         
            <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-base-content mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-base-100"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-1">
                  Profile Picture
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  {uploading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || user.isBlocked}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading || user.isBlocked
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>

        
            {!user.isPremium && !user.isBlocked ? (
              <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Upgrade to Premium</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Report unlimited issues and get priority support
                    </p>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all shadow-sm whitespace-nowrap"
                  >
                    {subscribing ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      "Subscribe - 1000tk"
                    )}
                  </button>
                </div>
              </div>
            ) : user.isPremium && !user.isBlocked ? (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl"></span>
                  <div>
                    <p className="font-bold text-green-700">Premium Member</p>
                    <p className="text-sm text-green-600">
                      You have access to all premium features
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={logOut}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
