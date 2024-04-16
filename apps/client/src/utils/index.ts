import { Role, User } from "../types";
import { NavigateFunction } from "react-router-dom";

export function navigateUserOnAuth(user: User, navigate: NavigateFunction) {
  if (user.role === Role.ADMIN) {
    navigate("/dashboard", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
}
