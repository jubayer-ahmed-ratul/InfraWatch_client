import { useContext } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext"; 

const useAuth = () => useContext(AuthContext);

export default useAuth;
