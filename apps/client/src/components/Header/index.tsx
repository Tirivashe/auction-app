import { Avatar, Button, Group } from "@mantine/core";
import { useAuthStore } from "../../store";
import { Link } from "react-router-dom";

const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  return (
    <Group h="inherit" justify="flex-end" px="lg">
      <Avatar color="blue" radius="xl" component={Link} to="/profile">
        {user?.username.charAt(0).toUpperCase()}
      </Avatar>
      <Button onClick={logout}>Logout</Button>
    </Group>
  );
};

export default Header;
