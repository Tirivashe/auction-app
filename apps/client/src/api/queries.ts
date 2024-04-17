import type { AxiosResponse } from "axios";
import { axiosInstance } from "./constants";
import { AuctionItem } from "../types";

export const getAllUsers = (): Promise<{ username: string; _id: string }[]> => {
  return fetch("/api/user").then((res) => res.json());
};

export const getBidsByItemId = (
  itemId: string
): Promise<{ _id: string; bidAmount: number }[]> => {
  return fetch(`/api/bid/${itemId}`).then((res) => res.json());
};

export const getAllAuctionItems = async (
  filter: string = "",
  page: number = 1,
  order: "DESC" | "ASC"
) => {
  const res: AxiosResponse<AuctionItem[]> = await axiosInstance.get(
    `/api/items?filter=${filter}&order=${order}&page=${page}`
  );
  return res.data;
};
