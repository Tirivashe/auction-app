import { Container } from "@mantine/core";
import { ItemTable } from "../../components/ItemTable";
import { useSearchParams } from "react-router-dom";
import { useFetchAuctionItems } from "../../hooks/useFetchAuctionItems";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const filter = searchParams.get("filter");
  const order = searchParams.get("order") as "DESC" | "ASC" | null;
  const deferredFilter = useDebounce(filter, 500);
  const { data, isError, isLoading } = useFetchAuctionItems({
    filter: deferredFilter,
    order,
    limit: 1000,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["auctionItems"] });
  }, [queryClient, deferredFilter, order]);

  if (isError) {
    return <h2>Something Went Wrong</h2>;
  }
  if (typeof data === "object" && "error" in data) {
    return <h2>{data.error}</h2>;
  }
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container size="85%">
      <ItemTable
        data={data?.items || []}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </Container>
  );
};

export default DashboardPage;
