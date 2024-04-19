import axios from "axios";
const authStorageString = localStorage.getItem("auth-storage");
const parseAuthStorage: { state: { token: string } } | null = authStorageString
  ? JSON.parse(authStorageString)
  : null;

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${parseAuthStorage?.state.token || ""}`,
  },
});

export const setAuthToken = (token: string) => {
  axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
