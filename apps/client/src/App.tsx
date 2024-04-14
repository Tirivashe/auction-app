import { useEffect, useState } from "react";

import "./App.css";
import { DateTimePicker, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useGetSocketContext } from "./WebsocketContext";
import { Button, Group, TextInput } from "@mantine/core";
import { getAllUsers, getBidsByItemId } from "./api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const socket = useGetSocketContext();
  const [value, setValue] = useState<DateValue>();
  const [messageFromServer, setMessageFromServer] = useState("");
  const [messageFromClient, setMessageFromClient] = useState("");
  const [bidPrice, setBidPrice] = useState(7);
  const queryClient = useQueryClient();

  const ITEM_ID = "661bbbf79e69fdb73b1dcc8f";

  const { data: bids, isLoading } = useQuery({
    queryKey: ["bid", ITEM_ID],
    queryFn: () => getBidsByItemId(ITEM_ID),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const handleBid = (userId: string) => {
    socket.emit("createBidding", { itemId: ITEM_ID, userId, amount: bidPrice });
    setBidPrice(bidPrice + 1);
  };

  console.log(users);

  useEffect(() => {
    socket.on("connected", () => {
      console.log("web socket connected!!");
    });

    socket.on("reply", (message: string) => {
      setMessageFromServer(message);
    });

    socket.on("bid.created", () => {
      queryClient.invalidateQueries({ queryKey: ["bid", ITEM_ID] });
    });

    return () => {
      socket.off("connect");
      socket.off("reply");
      socket.off("bid.created");
    };
  }, [socket, queryClient]);

  useEffect(() => {
    const niceFormat = dayjs(value).format("DD MMM, YYYY hh:mm A");
    const epochNumber = dayjs(niceFormat).valueOf();
    console.log({ niceFormat, epochNumber });
  }, [value]);

  if (isLoading || usersLoading) {
    return <div> Loading... </div>;
  }

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
      <Group gap="md" py="lg">
        {users?.map((user) => (
          <Button key={user._id} onClick={() => handleBid(user._id)}>
            {user.username} Bids
          </Button>
        ))}
      </Group>
      <p>{messageFromServer}</p>
      <div>
        {bids?.reverse().map((bid) => <div key={bid._id}>{bid.bidAmount}</div>)}
      </div>
    </>
  );
}

export default App;
