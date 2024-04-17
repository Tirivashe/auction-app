import { useQuery } from "@tanstack/react-query";
import { getAllAuctionItems } from "../api/queries";
import { AuctionItem, ServerError } from "../types";

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
  return useQuery<AuctionItem[] | ServerError, ServerError>({
    queryKey: ["auctionItems"],
    queryFn: () =>
      getAllAuctionItems(filter || "", page || 1, order || "ASC", limit || 10),
  });
};
