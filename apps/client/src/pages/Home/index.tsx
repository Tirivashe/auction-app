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
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import ItemList from "../../components/ItemList";
import { IconChevronCompactUp } from "@tabler/icons-react";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const filter = searchParams.get("filter");
  const order = searchParams.get("order") as "DESC" | "ASC" | null;
  const deferredFilter = useDebounce(filter, 500);
  const { data, isError, isLoading } = useFetchAuctionItems({
    filter: deferredFilter,
    order,
    page,
    limit: 10,
  });

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      prev.set("filter", e.target.value);
      return prev;
    });
  };

  const sortPrices = () => {
    setSearchParams((prev) => {
      prev.set("order", prev.get("order") === "DESC" ? "ASC" : "DESC");
      return prev;
    });
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["auctionItems", page] });
  }, [queryClient, deferredFilter, order, page]);

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
        <h2>No items for auctioning found</h2>
      </Center>
    );
  }

  return (
    <Stack p="lg" gap="xl">
      <Flex gap="xl" px="2rem">
        <TextInput
          flex={1}
          placeholder="Filter items"
          onChange={handleFilter}
          value={filter || ""}
        />
        <Button
          rightSection={
            <IconChevronCompactUp
              style={{ rotate: order === "DESC" ? "180deg" : "0deg" }}
            />
          }
          onClick={sortPrices}
        >
          Sort Price
        </Button>
      </Flex>
      <ItemList items={data.items} />
      <Group justify="flex-end">
        <Pagination.Root
          total={data.totalPages}
          value={page}
          onChange={setPage}
        >
          <Group>
            <Pagination.Previous
              disabled={!data.hasPrevious}
              onClick={() => setPage((prev) => prev - 1)}
            />
            <Pagination.Items />
            <Pagination.Next
              disabled={!data.hasNext}
              onClick={() => setPage((prev) => prev + 1)}
            />
          </Group>
        </Pagination.Root>
      </Group>
    </Stack>
  );
};

export default HomePage;
