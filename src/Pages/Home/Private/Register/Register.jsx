import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth"; 
import GoogleLogin from "../GoogleLogin/GoogleLogin";

const Register = () => {
  const { registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleRegistration = async (data) => {
    try {
      const userCredential = await registerUser(data.email, data.password);
      console.log("User registered:", userCredential.user);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Your <span className="text-green-600">Account</span>
        </h2>

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              className="input w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
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
              className="input w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <a href="#" className="text-green-600 hover:underline text-sm">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition text-lg"
          >
            Register
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <GoogleLogin />

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
