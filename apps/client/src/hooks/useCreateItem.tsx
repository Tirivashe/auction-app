import { useMutation } from "@tanstack/react-query";
import { AuthorItemResponse, ServerError, UpdateItemDto } from "../types";
import { createItem } from "../api/mutations";

export const useCreateItem = () => {
  return useMutation<
    AuthorItemResponse | ServerError,
    ServerError,
    UpdateItemDto,
    unknown
  >({
    mutationFn: (body: UpdateItemDto) => createItem(body),
  });
};
