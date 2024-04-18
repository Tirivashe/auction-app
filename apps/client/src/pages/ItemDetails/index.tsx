import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  Group,
  Image,
  Loader,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./ItemDetails.module.css";
import useFetchItemById from "../../hooks/useFetchItemById";
import { getRemainingTime } from "../../utils";
import React, { useEffect, useState } from "react";
import { useGetSocketContext } from "../../WebsocketContext";
import { useQueryClient } from "@tanstack/react-query";
import BidsList from "../../components/BidsList";
import { useAuthStore } from "../../store";
import useToggleAutoBid from "../../hooks/useToggleAutoBid";
import { IconSettings } from "@tabler/icons-react";

const ItemDetailsPage = () => {
  const { id } = useParams();
  const socket = useGetSocketContext();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [amount, setAmount] = useState(1);
  const [showWinner, setShowWinner] = useState(false);
  const [checked, setChecked] = useState(false);
  const { mutate } = useToggleAutoBid(user?._id ?? "", id ?? "");
  const navigate = useNavigate();
  const { data, isError, isLoading, isFetching } = useFetchItemById(
    user?._id ?? "",
    id ?? ""
  );

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasExpired: false,
  });

  const handleBid = (itemId: string, e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    socket.emit("createBidding", {
      itemId,
      userId: user?._id,
      amount,
      autobid: checked,
    });
  };

  const handleAutoBidChange = () => {
    mutate();
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    if (remainingTime.hasExpired) {
      queryClient.invalidateQueries({ queryKey: ["item", id] });
      setShowWinner(true);
    }
  }, [remainingTime.hasExpired, queryClient, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof data === "object" && "error" in data) {
      return;
    }
    if (!data) {
      return;
    }
    setChecked(data.autobid);
    const intervalId = setInterval(() => {
      const time = getRemainingTime(data.item.expiresAt);
      setRemainingTime({ ...time });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data]);

  useEffect(() => {
    socket.on("connected", () => {
      console.log("web socket connected!!");
    });

    socket.on("bid.created", () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    });

    return () => {
      socket.off("connect");
      socket.off("bid.created");
    };
  }, [socket, queryClient]);

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <Loader />
      </Center>
    );
  }

  if (isError || (typeof data === "object" && "error" in data)) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>Something went wrong</h2>
      </Center>
    );
  }

  if (!data) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>No item for auctioning found</h2>
      </Center>
    );
  }

  return (
    <Container className={classes.container} my="sm">
      {!showWinner && (
        <Stack py="md" gap={0}>
          <Text ta="center" fz="2.25rem" fw="700">
            Auction Ending Soon!
          </Text>
          <Group gap="sm" align="center" justify="center">
            {Object.entries(remainingTime).map(([key, time]) => {
              if (typeof time === "boolean") return;
              return (
                <Paper shadow="sm" radius="md" p="md" key={key}>
                  <Stack>
                    <Text ta="center" size="3.5rem" fw="700">
                      {time}
                    </Text>
                    <Text ta="center" size="sm">
                      {key}
                    </Text>
                  </Stack>
                </Paper>
              );
            })}
          </Group>
        </Stack>
      )}
      {showWinner && (
        <Title tt="capitalize" size="2.5rem" ta="center" c="green.8" py="xl">
          Awarded to{" "}
          {isFetching ? "..." : data.item?.winner?.username || "no one"} for $
          {isFetching ? "" : data.item.awardedFor}
        </Title>
      )}
      <Group mt="2rem" gap="lg" justify="space-between" align="flex-start">
        <Stack
          gap="lg"
          component="form"
          onSubmit={(e) => handleBid(data.item._id, e)}
        >
          <Title fz="2.25rem">{data.item.name}</Title>
          <Flex gap="md" align="center">
            <Group gap="sm" justify="space-between" align="center">
              <Text size="1.25rem" fw="500">
                ${data.item.price}
              </Text>
              <Badge size="xs">Current Price</Badge>
            </Group>
            <Group gap="sm" align="center" justify="space-between">
              <NumberInput
                label="Your bid here"
                prefix="$"
                allowDecimal={false}
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(e as number)}
              />
            </Group>
          </Flex>
          <Group justify="space-between">
            <Button
              flex={1}
              type="submit"
              fullWidth
              disabled={!data.item?.isActive}
            >
              Submit Bid
            </Button>
            <Checkbox
              checked={checked}
              label="Autobid"
              disabled={!data.item?.isActive}
              onClick={handleAutoBidChange}
            />
            <ActionIcon
              onClick={() => navigate(`/config/${user?._id}`)}
              disabled={!data.item.isActive}
            >
              <IconSettings
                style={{ width: "80%", height: "80%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Stack>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={220}
          alt="Norway"
          radius="md"
        />
      </Group>
      <Stack gap="3rem" my="3rem">
        <Stack>
          <Title>Description</Title>
          <Text>{data.item.description}</Text>
        </Stack>
        <Stack>
          <Title>Latest Bids</Title>
          <BidsList itemId={data.item._id} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default ItemDetailsPage;
