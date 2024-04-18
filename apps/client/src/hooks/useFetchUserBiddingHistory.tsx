import { useQuery } from "@tanstack/react-query";
import { getUserBiddingHistory } from "../api/queries";
import { ServerError, UserBiddingHistory } from "../types";

const useFetchUserBiddingHistory = (userId: string) => {
  return useQuery<UserBiddingHistory[] | ServerError, ServerError>({
    queryKey: ["userHistory", userId],
    queryFn: () => getUserBiddingHistory(userId),
  });
};

export default useFetchUserBiddingHistory;
