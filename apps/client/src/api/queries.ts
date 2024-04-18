import type { AxiosResponse } from "axios";
import { axiosInstance } from "./constants";
import {
  AuctionItem,
  Bid,
  ItemServerResponse,
  UserBiddingHistory,
} from "../types";

export const getAllUsers = (): Promise<{ username: string; _id: string }[]> => {
  return fetch("/api/user").then((res) => res.json());
};

export const getBidsByItemId = async (itemId: string) => {
  const res: AxiosResponse<Bid[]> = await axiosInstance.get(
    `/api/bid/${itemId}`
  );
  return res.data;
};
export const getAllAuctionItems = async (
  filter: string = "",
  page: number = 1,
  order: "DESC" | "ASC",
  limit: number = 10
) => {
  const res: AxiosResponse<ItemServerResponse> = await axiosInstance.get(
    `/api/items?filter=${filter}&order=${order}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getItemById = async (itemId: string) => {
  const res: AxiosResponse<AuctionItem> = await axiosInstance.get(
    `/api/items/${itemId}`
  );
  return res.data;
};

export const getUserBiddingHistory = async (userId: string) => {
  const res: AxiosResponse<UserBiddingHistory[]> = await axiosInstance.get(
    `api/user/${userId}/history`
  );
  return res.data;
};
