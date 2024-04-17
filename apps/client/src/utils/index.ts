import { Role, UpdateItemDto, User } from "../types";
import { NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export function navigateUserOnAuth(user: User, navigate: NavigateFunction) {
  if (user.role === Role.ADMIN) {
    navigate("/dashboard", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
}

export const modifyFormData = (data: UpdateItemDto) => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key, value]) => {
        if (value) return [key, value];
      })
      .map(([key, value]) => {
        if (value instanceof Date) {
          return [key, dayjs(value).format("DD MMM, YYYY hh:mm A")];
        }
        if (value instanceof File) {
          return [key, value.name];
        }
        return [key, value];
      })
  );
};

export const getRemainingTime = (deadline: Date) => {
  const now = new Date();
  dayjs.extend(duration);
  const remainingTime = dayjs.duration(dayjs(deadline).diff(now));
  return {
    days: remainingTime.days(),
    hours: remainingTime.hours(),
    minutes: remainingTime.minutes(),
    seconds: remainingTime.seconds(),
  };
};
