import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
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
          <App />
        </QueryClientProvider>
      </WebsocketProvider>
    </MantineProvider>
  </React.StrictMode>
);
