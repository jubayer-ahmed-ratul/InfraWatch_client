import axios from "axios";
import { getAuth } from "firebase/auth";

const AxiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  
  AxiosSecure.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return AxiosSecure;
};

export default useAxiosSecure;