import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import useAxiosSecure from "../../../../hooks/useAxiosSecure"; 

const GoogleLogin = () => {
  const { googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };

   
      const response = await axiosSecure.post("/users", userData);

      const dbUser = response.data;
      console.log("User saved/fetched from DB:", dbUser);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        text: `Welcome, ${dbUser.name || dbUser.email}!`,
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.response?.data?.error || error.message,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="btn bg-base-100 text-base-content border-base-300 flex items-center gap-2 w-full hover:bg-base-200 transition"
    >
   
      <svg
        aria-label="Google logo"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <path d="m0 0H512V512H0" fill="#fff"></path>
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
          <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
        </g>
      </svg>
      Login with Google
    </button>
  );
};

export default GoogleLogin;
