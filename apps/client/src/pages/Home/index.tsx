import { useSearchParams } from "react-router-dom";
import { useFetchAuctionItems } from "../../hooks/useFetchAuctionItems";
import {
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Pagination,
  Stack,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import ItemList from "../../components/ItemList";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const filter = searchParams.get("filter");
  const order = searchParams.get("order") as "DESC" | "ASC" | null;
  const page = searchParams.get("page") as number | null;
  const deferredFilter = useDebounce(filter, 500);
  const {
    data: items,
    isError,
    isLoading,
  } = useFetchAuctionItems({ filter: deferredFilter, order, page, limit: 10 });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["auctionItems"] });
  }, [queryClient, deferredFilter, order]);

  if (isLoading) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <Loader />
      </Center>
    );
  }

  if (isError || (typeof items === "object" && "error" in items)) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>Something went wrong</h2>
      </Center>
    );
  }

  if (!items) {
    return (
      <Center h="100vh" w="100vw" style={{ overflow: "hidden" }}>
        <h2>No items for auctioning found</h2>
      </Center>
    );
  }

  return (
    <Stack p="lg" gap="xl">
      <Flex gap="sm">
        <TextInput flex={1} placeholder="Filter items" />
        <Button>Filter</Button>
      </Flex>
      <ItemList items={items} />
      <Group justify="flex-end">
        <Pagination total={items.length} />
      </Group>
    </Stack>
  );
};

export default HomePage;
