import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Pages/Layout/RootLayout";
import AuthLayout from "../Pages/Layout/AuthLayout";
import HomePage from "../Pages/Home/Home/HomePage";
import Login from "../Pages/Home/Private/Login/Login";
import Register from "../Pages/Home/Private/Register/Register";
import AllIssuesPage from "../Pages/Issues/AllIssuesPage/AllIssuesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
      { index: true, element: <HomePage /> },
      { path: "allissues", element: <AllIssuesPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
