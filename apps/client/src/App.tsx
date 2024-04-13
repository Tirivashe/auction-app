import { useEffect, useState } from "react";

import "./App.css";
import { DateTimePicker, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useGetSocketContext } from "./WebsocketContext";
import { Button, Group, TextInput } from "@mantine/core";

function App() {
  const [value, setValue] = useState<DateValue>();
  const [messageFromServer, setMessageFromServer] = useState("");
  const [messageFromClient, setMessageFromClient] = useState("");
  const socket = useGetSocketContext();

  useEffect(() => {
    socket.on("connected", () => {
      console.log("web socket connected!!");
    });

    socket.on("reply", (message: string) => {
      setMessageFromServer(message);
    });

    return () => {
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    const niceFormat = dayjs(value).format("DD MMM, YYYY hh:mm A");
    const epochNumber = dayjs(niceFormat).valueOf();
    console.log({ niceFormat, epochNumber });
  }, [value]);

  return (
    <>
      <DateTimePicker
        valueFormat="DD MMM, YYYY hh:mm A"
        label="Pick date and time"
        placeholder="Pick date and time"
        value={value}
        onChange={setValue}
      />
      <Group>
        <TextInput
          value={messageFromClient}
          onChange={(e) => setMessageFromClient(e.target.value)}
        />
        <Button onClick={() => socket.emit("message", messageFromClient)}>
          Send message to server
        </Button>
      </Group>
      <p>{messageFromServer}</p>
    </>
  );
}

export default App;
