import { useQuery } from "@tanstack/react-query";
import { getBidsByItemId } from "../api/queries";
import { Bid, ServerError } from "../types";

const useFetchBidsByItemId = (itemId: string) => {
  return useQuery<Bid[] | ServerError, ServerError>({
    queryKey: ["bids"],
    queryFn: () => getBidsByItemId(itemId),
  });
};

export default useFetchBidsByItemId;
