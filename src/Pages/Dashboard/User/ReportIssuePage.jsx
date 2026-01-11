import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Upload, MapPin, Tag, AlertCircle } from "lucide-react";

const categories = [
  "Streetlight",
  "Road",
  "Garbage",
  "Safety",
  "Public Space",
  "Electricity",
  "Sanitation",
  "Emergency",
  "Other",
];

const ReportIssuePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const freeLimitReached = !user?.isPremium && user?.issuesCount >= 3;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (freeLimitReached) return;

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
          }`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (data.success) imageUrl = data.data.url;
      }

      const newIssue = {
        title,
        description,
        category,
        location,
        image: imageUrl,

        status: "Pending",
        priority: "Normal",
        upvotes: 0,
        boosted: false,

        createdBy: {
          userId: user.uid,
          name: user.displayName,
          userEmail: user.email,
        },

        assignedStaff: null,
        timeline: [
          {
            status: "Pending",
            message: "Issue reported",
            updatedBy: user.displayName,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await axiosSecure.post("/issues", newIssue);

      Swal.fire({
        icon: "success",
        title: "Issue Reported",
        text: "Your issue has been submitted successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/dashboard/my-issues");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to report issue. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Report an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Issue
            </span>
          </h1>
          <p className="text-base-content/70 mt-1">Help us improve your community</p>
        </div>

        {freeLimitReached && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-600" />
              <div>
                <h3 className="font-bold text-yellow-800">
                  Free Limit Reached
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Upgrade to Premium to report unlimited issues.
                </p>
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={freeLimitReached}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            <textarea
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={isMobile ? 3 : 4}
              disabled={freeLimitReached}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={freeLimitReached}
              className="w-full px-4 py-3 border rounded-lg"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={freeLimitReached}
              className="w-full px-4 py-3 border rounded-lg"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={freeLimitReached}
            />

            <button
              disabled={loading || freeLimitReached}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {loading ? "Reporting..." : "Report Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
