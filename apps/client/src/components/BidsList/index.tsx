import useFetchBidsByItemId from "../../hooks/useFetchBidsByItemId";
import { Center, Group, Loader, Stack, Text } from "@mantine/core";

type Props = {
  itemId: string;
};

const BidsList = ({ itemId }: Props) => {
  const { data: bids, isError, isLoading } = useFetchBidsByItemId(itemId ?? "");

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <Loader />
      </Center>
    );
  }

  if (isError || (typeof bids === "object" && "error" in bids)) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>Something went wrong</h2>
      </Center>
    );
  }

  if (!bids || bids.length < 1) {
    return (
      <div>
        <Text c="dimmed">There are no bids for this item yet</Text>
      </div>
    );
  }

  return (
    <Stack>
      {bids.map((bid) => (
        <Group
          justify="apart"
          align="center"
          px="md"
          key={bid?._id}
          style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
        >
          <Text size="xl" fw="400" tt="capitalize" flex={1}>
            {bid?.user?.username}
          </Text>
          <Text size="xl" fw="600">
            ${bid?.bidAmount}
          </Text>
        </Group>
      ))}
    </Stack>
  );
};

export default BidsList;
