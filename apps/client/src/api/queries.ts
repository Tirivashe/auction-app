export const getAllUsers = (): Promise<{ username: string; _id: string }[]> => {
  return fetch("/api/user").then((res) => res.json());
};

export const getBidsByItemId = (
  itemId: string
): Promise<{ _id: string; bidAmount: number }[]> => {
  return fetch(`/api/bid/${itemId}`).then((res) => res.json());
};
