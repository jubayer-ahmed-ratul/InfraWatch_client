import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import GoogleLogin from "../GoogleLogin/GoogleLogin";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;
  const imageUploadURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

  const handleRegistration = async (data) => {
    try {
      const safeData = { ...data, password: "***hidden***" };
      console.log("Registration Data:", safeData);

 
      let photoURL = "";
      if (data.photo && data.photo[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const uploadRes = await fetch(imageUploadURL, {
          method: "POST",
          body: formData,
        });

        const imgData = await uploadRes.json();
        if (imgData.success) {
          photoURL = imgData.data.url;
          console.log("Uploaded Photo URL:", photoURL);
        } else {
          throw new Error("Image upload failed");
        }
      }

    
      const userCredential = await registerUser(data.email, data.password);
      await updateUserProfile(data.name, photoURL);

   
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: photoURL,
        createdAt: new Date(),
      };

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const savedUser = await response.json();
      console.log("Saved user in backend:", savedUser);

    
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: `Welcome, ${data.name}!`,
        showConfirmButton: false,
        timer: 2000,
      });

    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "This email is already in use. Please login instead.",
          confirmButtonText: "Go to Login"
        }).then(() => window.location.href = "/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Your <span className="text-green-600">Account</span>
        </h2>

        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
           <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              {...register("name", { required: "Name is required" })}
              className="input w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

           <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="input w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

           <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
              className="input w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-400"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

           <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-lg"
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
