import {
  AuthorItemResponse,
  LoginDto,
  ServerAuthResponse,
  SignUpDto,
  UpdateItemDto,
} from "../types";
import axios, { type AxiosResponse } from "axios";
import { axiosInstance } from "./constants";

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

export const deleteItem = async (id: string) => {
  await axiosInstance.delete(`/api/item/${id}`);
};

export const createItem = async (createItemDto: UpdateItemDto) => {
  const res: AxiosResponse<AuthorItemResponse> = await axiosInstance.post(
    "/api/item",
    createItemDto
  );
  return res.data;
};

export const updateItem = async (
  itemId: string,
  updateItemDto: UpdateItemDto
) => {
  const res = await axiosInstance.patch(`/api/item/${itemId}`, updateItemDto);
  return res.data;
};

export const toggleAutoBid = (userId: string, itemId: string) => {
  return axiosInstance.patch("/api/user/toggle-autobid", { userId, itemId });
};

export const setUserAutobidConfig = async (
  userId: string,
  maxBidAmount: number,
  autoBidPercentage: number
) => {
  const res: AxiosResponse<void> = await axiosInstance.patch(
    `/api/user/${userId}/settings`,
    { maxBidAmount, autoBidPercentage }
  );
  return res.data;
};
