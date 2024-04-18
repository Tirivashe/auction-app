import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { AuctionItem } from "../../types";
import { useNavigate } from "react-router-dom";

type Props = {
  item: AuctionItem;
};

const ItemCard = ({ item }: Props) => {
  const navigate = useNavigate();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{item.name}</Text>
        <Badge color="pink.7">Price: ${item.price}</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {item.description}
      </Text>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => navigate(`/items/${item._id}`)}
      >
        Bid Now!
      </Button>
    </Card>
  );
};

export default ItemCard;
