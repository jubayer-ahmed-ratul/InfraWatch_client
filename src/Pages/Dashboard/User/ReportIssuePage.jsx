import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Upload, MapPin, Tag, AlertCircle } from "lucide-react";

const categories = ["Streetlight", "Road", "Garbage", "Safety", "Public Space", "Electricity", "Sanitation", "Emergency", "Other"];

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const freeLimitReached = !user?.isPremium && user?.issuesCount >= 3;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.success) {
          imageUrl = data.data.url;
        }
      }

      const newIssue = {
        title,
        description,
        category,
        status: "Pending",
        priority: "Normal",
        location,
        image: imageUrl,
        upvotes: 0,
        boosted: false,
        createdBy: {
          userId: user.uid,
          name: user.displayName,
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

      alert("Issue reported successfully!");
      navigate("/dashboard/my-issues");
    } catch (err) {
      console.error(err);
      alert("Failed to report issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Report an <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Issue</span></h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Help us improve your community by reporting issues
          </p>
        </div>

    
        {freeLimitReached && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800">Free Limit Reached</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  You've reached your limit of 3 free issues. Upgrade to Premium to report unlimited issues.
                </p>
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        )}

    
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Briefly describe the issue"
                  required
                  disabled={freeLimitReached}
                />
              </div>

          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={isMobile ? 3 : 4}
                  placeholder="Provide more details about the issue..."
                  required
                  disabled={freeLimitReached}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="inline-block w-4 h-4 mr-1" />
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    disabled={freeLimitReached}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline-block w-4 h-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter location or landmark"
                    disabled={freeLimitReached}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Upload className="inline-block w-4 h-4 mr-1" />
                  Upload Image
                </label>
                
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 sm:h-56 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed rounded-lg cursor-pointer ${
                      freeLimitReached 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={freeLimitReached}
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={freeLimitReached || loading}
                className={`w-full py-3 sm:py-4 px-4 rounded-lg font-medium transition-all ${
                  freeLimitReached
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : loading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Reporting Issue...
                  </span>
                ) : freeLimitReached ? (
                  'Upgrade to Report More Issues'
                ) : (
                  'Report Issue'
                )}
              </button>

           
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;