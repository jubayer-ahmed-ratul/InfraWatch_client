import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import { router } from './Routes/router.jsx';
import AuthProvider from "./context/AuthProvider/AuthProvider.jsx";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeAwareToast from './components/ThemeAwareToast/ThemeAwareToast.jsx';


const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ThemeAwareToast />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
