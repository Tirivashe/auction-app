import AuthPage from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ItemDetailsPage from "./pages/ItemDetails";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import AutobidConfig from "./pages/AutobidConfig";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "items/:id", element: <ItemDetailsPage /> },
      {
        path: "dashboard",
        element: (
          <AdminOnlyRoute>
            <DashboardPage />
          </AdminOnlyRoute>
        ),
      },
      { path: "profile", element: <ProfilePage /> },
      { path: "config/:id", element: <AutobidConfig /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
