import { createBrowserRouter } from "react-router";
import RootLayout from "../Pages/Layout/RootLayout";
import HomePage from "../Pages/Home/Home/HomePage";
import AuthLayout from "../Pages/Layout/AuthLayout";
import Login from "../Pages/Home/Private/Login/Login";
import Register from "../Pages/Home/Private/Register/Register";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,      
        element: <HomePage></HomePage>
      },
      
    ],
  },
  {
    path:"/",
    Component: AuthLayout,
    children:[
      {
        path:'login',
        Component: Login
      },
      {
        path:'register',
        Component: Register
      }
    ]
  }
]);
