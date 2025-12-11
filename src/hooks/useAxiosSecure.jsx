

import axios from "axios";

const AxiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  return AxiosSecure;
};

export default useAxiosSecure; // ✅ Default export
