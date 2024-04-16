import { LoginDto, SignUpDto } from "../types";

export const signUp = (body: SignUpDto) => {
  return fetch("/api/auth/signup", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

export const login = (body: LoginDto) => {
  return fetch("/api/auth/login", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());
};
