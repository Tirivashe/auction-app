import { useQuery } from "@tanstack/react-query";
import { getItemById } from "../api/queries";
import { AuctionItem, ServerError } from "../types";

const useFetchItemById = (userId: string, itemId: string) => {
  return useQuery<
    { item: AuctionItem; autobid: boolean } | ServerError,
    ServerError
  >({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(userId, itemId),
  });
};

export default useFetchItemById;
