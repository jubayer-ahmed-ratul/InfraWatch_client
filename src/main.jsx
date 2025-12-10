import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './app.css';
import { router } from './Routes/router.jsx';
import AuthProvider from "./context/AuthProvider/AuthProvider.jsx"

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
