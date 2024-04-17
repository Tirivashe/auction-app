import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { AuctionItem } from "../../types";
import { Link } from "react-router-dom";

type Props = {
  item: AuctionItem;
};

const Item = ({ item }: Props) => {
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
        <Badge color={item.isActive ? "green" : "pink.8"}>
          {item.isActive ? "Active" : "Closed"}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {item.description}
      </Text>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        disabled={!item.isActive}
        component={Link}
        to={`/items/${item._id}`}
      >
        Bid Now!
      </Button>
    </Card>
  );
};

export default Item;
