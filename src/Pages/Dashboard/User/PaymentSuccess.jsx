// PaymentSuccess.jsx
import { useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const axiosSecure = useAxiosSecure();
  const { user, updateUser } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const email = decodeURIComponent(query.get("email"));
    
    if (email) {
      axiosSecure
        .patch("/users/premium", { email })
        .then(res => {
          if (res.data.success) {
           
            const updatedUser = { 
              ...user, 
              isPremium: true, 
              premium: true 
            };
            
          
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert("Payment successful! You are now a Premium member.");
            navigate("/dashboard/profile");
            
        
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            alert("Payment succeeded but failed to update your profile. Contact support.");
          }
        })
        .catch(err => {
          console.error(err);
          alert("Payment succeeded but failed to update your profile. Contact support.");
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600">Processing Payment...</h1>
        <p className="text-gray-600 mt-2">Please wait while we update your account</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;