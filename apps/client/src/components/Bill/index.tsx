import {
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import useFetchItemById from "../../hooks/useFetchItemById";
import { formatTime } from "../../utils";

type Props = {
  itemId: string;
  userId: string;
};

const Bill = ({ userId, itemId }: Props) => {
  const { data: bill, isLoading, isError } = useFetchItemById(userId, itemId);

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (isError || (typeof bill === "object" && "error" in bill)) {
    return (
      <Center>
        <h2>Something went wrong</h2>
      </Center>
    );
  }

  if (!bill) {
    return (
      <Center>
        <h2>No bill found</h2>
      </Center>
    );
  }

  return (
    <Stack gap="lg" px="lg">
      <Group align="center" justify="space-between">
        <Title fz="h3">Invoice ID</Title>
        <Text truncate="end"># {bill.item._id.slice(0, 5)}</Text>
      </Group>
      <Group align="center" justify="space-between">
        <Text>Date</Text>
        <Text>{formatTime(bill.item.updatedAt)}</Text>
      </Group>
      <Group align="center" justify="space-between">
        <Text>Bill to</Text>
        <Text>{bill.item.winner.email}</Text>
      </Group>
      <Group align="center" justify="space-between">
        <Text>Item</Text>
        <Text>{bill.item.name}</Text>
      </Group>
      <Divider mt="lg" />
      <Group align="center" justify="space-between">
        <Text>Total</Text>
        <Title>${bill.item.awardedFor}</Title>
      </Group>
    </Stack>
  );
};

export default Bill;
