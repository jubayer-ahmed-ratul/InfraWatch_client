import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"; 
import Swal from "sweetalert2";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import GoogleLogin from "../GoogleLogin/GoogleLogin";

const Login = () => {
  const { signInUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    try {
      await signInUser(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${data.email}!`,
        showConfirmButton: false,
        timer: 2000,
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
  };

  // Redirect after login based on role
  useEffect(() => {
    if (user) {
      if (user.role === "staff") {
        navigate("/dashboard/staff", { replace: true });
      } else if (user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Welcome Back <span className="text-green-600">Login</span>
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              className="input px-4 w-full py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              aria-invalid={errors.password ? "true" : "false"}
              className="input px-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-green-600 hover:underline text-sm">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md text-lg"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google login button */}
        <GoogleLogin />

        <p className="text-center text-gray-500 text-sm mt-6">
          Do not have an account?{" "}
          <a href="/register" className="text-green-600 font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
