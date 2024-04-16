import { Button, Group } from "@mantine/core";
import { useAuthStore } from "../../store";

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <Group h="inherit" justify="flex-end" px="lg">
      <Button onClick={logout}>Logout</Button>
    </Group>
  );
};

export default Header;
