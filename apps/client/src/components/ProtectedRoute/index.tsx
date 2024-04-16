import { useAuthStore } from "../../store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <Navigate to="/auth" replace={true} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
