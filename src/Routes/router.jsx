import { createBrowserRouter } from "react-router";
import RootLayout from "../Pages/Layout/RootLayout";
import HomePage from "../Pages/Home/Home/HomePage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,      // default route -> /
        element: <HomePage></HomePage>
      },
      
    ],
  },
]);
