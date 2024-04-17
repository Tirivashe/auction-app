import type { AxiosResponse } from "axios";
import { axiosInstance } from "./constants";
import { AuctionItem, Bid, ItemServerResponse } from "../types";

export const getAllUsers = (): Promise<{ username: string; _id: string }[]> => {
  return fetch("/api/user").then((res) => res.json());
};

export const getBidsByItem = async (itemId: string) => {
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
