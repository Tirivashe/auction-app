import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllAuctionItems } from "../api/queries";
import { ItemServerResponse, ServerError } from "../types";

export const useFetchAuctionItems = ({
  filter,
  order,
  page,
  limit,
}: {
  filter?: string | null;
  order?: "DESC" | "ASC" | null;
  page?: number | null;
  limit?: number | null;
}) => {
  return useQuery<ItemServerResponse | ServerError, ServerError>({
    queryKey: ["auctionItems", page],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getAllAuctionItems(filter || "", page || 1, order || "ASC", limit || 10),
  });
};
