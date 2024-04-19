import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { WebsocketProvider, socket } from "./WebsocketContext.ts";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <WebsocketProvider value={socket}>
        <QueryClientProvider client={queryClient}>
          <Notifications limit={1} />
          <App />
        </QueryClientProvider>
      </WebsocketProvider>
    </MantineProvider>
  </React.StrictMode>
);
