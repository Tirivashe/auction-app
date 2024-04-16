import React, { useEffect } from "react";
import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";
import { Role } from "../../types";

type Props = {
  children: React.ReactNode;
};

const AdminOnlyRoute = ({ children }: Props) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === Role.REGULAR) {
      navigate(-1);
    }
  }, [navigate, user]);

  return <>{children}</>;
};

export default AdminOnlyRoute;
