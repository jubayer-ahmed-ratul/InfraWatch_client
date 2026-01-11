import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"; 
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import GoogleLogin from "../GoogleLogin/GoogleLogin";
import useToast from "../../../../hooks/useToast";

const Login = () => {
  const { signInUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || "/";
  const { showToast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    try {
      await signInUser(data.email, data.password);
      showToast.loginSuccess(data.email.split('@')[0]);
      // Note: Redirect will be handled by useEffect when user role is loaded
    } catch (error) {
      showToast.error(`Login failed: ${error.message}`);
    }
  };

  // Demo login functions
  const handleDemoLogin = (email, password) => {
    setValue("email", email);
    setValue("password", password);
  };

  const handleAutoLogin = async (email, password) => {
    setValue("email", email);
    setValue("password", password);
    
    // Auto login after setting values
    try {
      await signInUser(email, password);
      const role = email.includes('admin') ? 'Admin' : email.includes('staff') ? 'Staff' : 'Citizen';
      showToast.success(`🚀 Demo login successful! Welcome ${role}!`);
      // Note: Redirect will be handled by useEffect when user role is loaded
    } catch (error) {
      showToast.error(`Demo login failed: ${error.message}`);
    }
  };

  // Redirect based on role
  useEffect(() => {
    if (user && user.role) {
      console.log('User logged in with role:', user.role); // Debug log
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
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-base-content mb-6 text-center">
          Welcome Back <span className="text-green-600">Login</span>
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-base-content">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              className="input px-4 w-full py-3 rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-base-100"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 font-medium text-base-content">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              aria-invalid={errors.password ? "true" : "false"}
              className="input px-4 py-3 w-full rounded-xl border border-base-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition bg-base-100"
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

        {/* Demo Login Buttons */}
        <div className="mt-6 p-4 bg-base-200 rounded-xl">
          <h3 className="text-sm font-semibold text-base-content mb-3 text-center"> Demo Login Credentials</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm rounded-lg transition border border-purple-300"
              >
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => handleAutoLogin("admin@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition"
              >
                 Login as Admin
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("hamimstaff@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition border border-blue-300"
              >
                Fill Staff
              </button>
              <button
                type="button"
                onClick={() => handleAutoLogin("hamimstaff@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
              >
                 Login as Staff
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("usert@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg transition border border-green-300"
              >
                Fill Citizen
              </button>
              <button
                type="button"
                onClick={() => handleAutoLogin("usert@gmail.com", "12345678")}
                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
              >
                 Login as Citizen
              </button>
            </div>
          </div>
          <div className="mt-3 text-xs text-base-content/60 space-y-1">
            <p className="text-center">• <strong>Fill</strong> buttons: Auto-fill credentials only</p>
            <p className="text-center">• <strong>Login as</strong> buttons: Auto-fill + Login instantly</p>
          </div>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-base-300"></div>
          <span className="mx-3 text-base-content/60 text-sm">OR</span>
          <div className="flex-1 h-px bg-base-300"></div>
        </div>

        <GoogleLogin />

        <p className="text-center text-base-content/60 text-sm mt-6">
          Do not have an account?{" "}
          <a href="/register" className="text-green-600 font-medium hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
