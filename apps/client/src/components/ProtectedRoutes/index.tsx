import { AppShell } from "@mantine/core";
import { useAuthStore } from "../../store";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../Header";

const ProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <Navigate to="/auth" replace={true} />;
  }
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default ProtectedRoutes;
