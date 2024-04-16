import { create } from "zustand";
import { ServerAuthSuccessResponse, User } from "../types";

type State = {
  token: string | null;
  user: User | null;
  setAuthResponse: (authResponse: ServerAuthSuccessResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<State>((set) => ({
  token: null,
  user: null,
  setAuthResponse: (authResponse: ServerAuthSuccessResponse) =>
    set(() => ({ token: authResponse.token, user: authResponse.user })),
  logout: () => set(() => ({ token: null, user: null })),
}));
