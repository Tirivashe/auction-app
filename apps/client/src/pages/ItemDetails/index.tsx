import { useParams } from "react-router-dom";
// import { useFetchAuctionItems } from "../../hooks/useFetchAuctionItems";

const ItemDetailsPage = () => {
  const { id } = useParams();
  // const { data: items, isError, isLoading } = useFetchAuctionItems();
  return (
    <div>
      <h1>ItemDetailsPage for item {id}</h1>
    </div>
  );
};

export default ItemDetailsPage;
