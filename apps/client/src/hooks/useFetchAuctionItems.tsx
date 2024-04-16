import { useQuery } from "@tanstack/react-query";
import { getAllAuctionItems } from "../api/queries";
import { AuctionItem, ServerError } from "../types";

export const useFetchAuctionItems = () => {
  return useQuery<AuctionItem[] | ServerError, ServerError>({
    queryKey: ["auctionItems"],
    queryFn: () => getAllAuctionItems(),
  });
};
