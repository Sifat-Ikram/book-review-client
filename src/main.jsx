import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/sign/Register.jsx";
import Login from "./components/pages/sign/Login.jsx";
import AuthProvider from "./components/provider/AuthProvider.jsx";
import DetailsPage from "./components/pages/detailsPage/DetailsPage.jsx";
import MyProfile from "./components/pages/profile/MyProfile.jsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/details/:id",
        element: <DetailsPage />
      },
      {
        path: "/profile/:id",
        element: <MyProfile />
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
