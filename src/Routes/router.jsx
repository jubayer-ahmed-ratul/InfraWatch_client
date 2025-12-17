// router.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Pages/Layout/RootLayout";
import AuthLayout from "../Pages/Layout/AuthLayout";
import DashboardLayout from "../Pages/Layout/DashboardLayout";

import HomePage from "../Pages/Home/Home/HomePage";
import Login from "../Pages/Home/Private/Login/Login";
import Register from "../Pages/Home/Private/Register/Register";
import AllIssuesPage from "../Pages/Issues/AllIssuesPage/AllIssuesPage";
import IssueDetailsPage from "../Pages/Issues/IssueDetailsPage/IssueDetailsPage";

import OverviewPage from "../Pages/Dashboard/User/OverviewPage";
import MyIssuesPage from "../Pages/Dashboard/User/MyIssuesPage";
import ReportIssuePage from "../Pages/Dashboard/User/ReportIssuePage";
import ProfilePage from "../Pages/Dashboard/User/ProfilePage";
import PaymentSuccess from "../Pages/Dashboard/User/PaymentSuccess";

import PrivateRoute from "./PrivateRoute";
import BoostSuccessPage from "../Pages/Issues/BoostSuccessPage/BoostSuccessPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "allissues", element: <AllIssuesPage /> },
      {
        path: "issues/:issueId",
        element: (
          <PrivateRoute>
            <IssueDetailsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />, 
      },
      {
        path:"boost-success",
        element:<BoostSuccessPage></BoostSuccessPage>
      }
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
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "my-issues", element: <MyIssuesPage /> },
      { path: "report-issue", element: <ReportIssuePage /> },
      { path: "profile", element: <ProfilePage /> },
      
    ],
  },
]);