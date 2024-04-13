import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("http://localhost:3000");
export const Websocket = createContext<Socket>(socket);
export const WebsocketProvider = Websocket.Provider;
export const useGetSocketContext = () => {
  const socket = useContext(Websocket);
  return socket;
};
