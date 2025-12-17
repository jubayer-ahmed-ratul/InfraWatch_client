import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BoostSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const issueId = searchParams.get("issueId");
  const userEmail = searchParams.get("email");

  useEffect(() => {
    const updateBoost = async () => {
      try {
        await axiosSecure.patch(`/issues/${issueId}/boost`);
        alert("Issue boosted successfully!");
        navigate(`/issues/${issueId}`);
      } catch (error) {
        console.error(error);
        alert("Failed to boost issue.");
        navigate(`/issues/${issueId}`);
      }
    };

    if (issueId) {
      updateBoost();
    } else {
      navigate("/");
    }
  }, [issueId, navigate, axiosSecure]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600">Processing Boost...</h1>
        <p className="text-gray-600 mt-2">
          Please wait while we update the issue priority
        </p>
      </div>
    </div>
  );
};

export default BoostSuccess;
