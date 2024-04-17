import { AuctionItem } from "../../types";
import { SimpleGrid } from "@mantine/core";
import Item from "../Item";

type Props = {
  items: AuctionItem[];
};

const ItemList = ({ items }: Props) => {
  return (
    <SimpleGrid
      cols={{ base: 1, xs: 2, sm: 3, md: 5 }}
      verticalSpacing="xl"
      spacing="md"
    >
      {items.map((item) => (
        <Item item={item} key={item._id} />
      ))}
    </SimpleGrid>
  );
};

export default ItemList;
