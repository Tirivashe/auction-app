import { LoginDto, ServerAuthResponse, SignUpDto } from "../types";
import axios, { type AxiosResponse } from "axios";

export const signUp = async (body: SignUpDto) => {
  const res: AxiosResponse<ServerAuthResponse> = await axios.post(
    "/api/auth/signup",
    body
  );
  return res.data;
};

export const login = async (body: LoginDto) => {
  const res: AxiosResponse<ServerAuthResponse> = await axios.post(
    "/api/auth/login",
    body
  );
  return res.data;
};
