import { useQuery } from "@tanstack/react-query";
import { getItemById } from "../api/queries";
import { AuctionItem, ServerError } from "../types";

const useFetchItemById = (itemId: string) => {
  return useQuery<AuctionItem | ServerError, ServerError>({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(itemId),
  });
};

export default useFetchItemById;
