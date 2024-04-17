import {
  Badge,
  Button,
  Center,
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
import { useParams } from "react-router-dom";
import classes from "./ItemDetails.module.css";
import useFetchItemById from "../../hooks/useFetchItemById";
import { getRemainingTime } from "../../utils";
import { useEffect, useState } from "react";

const ItemDetailsPage = () => {
  const { id } = useParams();
  const { data: item, isError, isLoading } = useFetchItemById(id ?? "");
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof item === "object" && "error" in item) {
      return;
    }
    if (!item) {
      return;
    }
    const intervalId = setInterval(() => {
      const { days, hours, minutes, seconds } = getRemainingTime(
        item.expiresAt
      );
      setRemainingTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [item]);

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <Loader />
      </Center>
    );
  }

  if (isError || (typeof item === "object" && "error" in item)) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>Something went wrong</h2>
      </Center>
    );
  }

  if (!item) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>No items for auctioning found</h2>
      </Center>
    );
  }

  return (
    <Container className={classes.container} my="sm">
      <Stack py="md" gap={0}>
        <Text ta="center" fz="2.25rem" fw="700">
          Auction Ending Soon!
        </Text>
        <Group gap="sm" align="center" justify="center">
          {Object.entries(remainingTime).map(([key, time]) => (
            <Paper shadow="sm" radius="md" p="md" key={key}>
              <Stack>
                <Text size="3.5rem" fw="700">
                  {time}
                </Text>
                <Text ta="center" size="sm">
                  {key}
                </Text>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Stack>
      <Group mt="2rem" gap="lg" justify="space-between" align="flex-start">
        <Stack gap="lg">
          <Title fz="2.25rem">{item.name}</Title>
          <Flex gap="md" align="center">
            <Group gap="sm" justify="space-between" align="center">
              <Text size="1.25rem" fw="500">
                ${item.price}
              </Text>
              <Badge>Current Price</Badge>
            </Group>
            <Group gap="sm" align="center" justify="space-between">
              <Text fz="h4">Your bid</Text>
              <NumberInput
                label="Price"
                prefix="$"
                allowDecimal={false}
                min={1}
                required
              />
            </Group>
          </Flex>
          <Button fullWidth>Submit Bid</Button>
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
          <Text>{item.description}</Text>
        </Stack>
        <Stack>
          <Title>Previous Bids</Title>
          <Text>There are no previous bids</Text>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ItemDetailsPage;
