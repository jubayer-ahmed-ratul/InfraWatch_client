import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BoostSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const userEmail = searchParams.get("userEmail");
    const userId = searchParams.get("userId");

    const updateBoost = async () => {
      try {
        await axiosSecure.patch(`/issues/${id}/boost`, {
          userEmail,
          userId
        });
        alert("Issue boosted successfully!");
        navigate(`/issues/${id}`);
      } catch (error) {
        console.error(error);
        alert("Failed to boost issue. Please contact support.");
        navigate(`/issues/${id}`);
      }
    };

    if (session_id && userEmail && userId) {
      updateBoost();
    } else {
      navigate(`/issues/${id}`);
    }
  }, [id, searchParams, navigate, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600">Processing Boost...</h1>
        <p className="text-gray-600 mt-2">Please wait while we update the issue priority</p>
      </div>
    </div>
  );
};

export default BoostSuccess;