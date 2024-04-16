import { useMutation } from "@tanstack/react-query";
import { LoginDto, ServerAuthSuccessResponse, ServerError } from "../types";
import { login } from "../api/mutations";

export const useLogin = () => {
  return useMutation<
    ServerAuthSuccessResponse | ServerError,
    ServerError,
    LoginDto,
    unknown
  >({
    mutationFn: (loginDto: LoginDto) => login(loginDto),
  });
};
