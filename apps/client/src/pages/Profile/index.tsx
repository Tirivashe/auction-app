import cx from "clsx";
import { useState } from "react";
import {
  Table,
  ScrollArea,
  Badge,
  ActionIcon,
  Container,
  Modal,
} from "@mantine/core";
import classes from "./Profile.module.css";
import useFetchUserBiddingHistory from "../../hooks/useFetchUserBiddingHistory";
import { useAuthStore } from "../../store";
import { BidStatus } from "../../types";
import { formatTime } from "../../utils";
import { IconFileInvoice } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Bill from "../../components/Bill";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const [itemId, setItemId] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const {
    data: items,
    isLoading,
    isError,
  } = useFetchUserBiddingHistory(user?._id ?? "");
  if (isError) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (typeof items === "object" && "error" in items) {
    return <div>{items.message}</div>;
  }

  if (!items) {
    return <div>No data</div>;
  }

  const openBill = (id: string) => {
    setItemId(id);
    open();
  };

  const rows = items.map((row) => {
    const color =
      row.bidStatus === BidStatus.Won
        ? "green"
        : row.bidStatus === BidStatus.Lost
          ? "red"
          : "orange";
    return (
      <Table.Tr key={row._id}>
        <Table.Td>{row?.item?.name}</Table.Td>
        <Table.Td>${row?.item?.price}</Table.Td>
        <Table.Td>
          <Badge color={color}>
            {row?.bidStatus === BidStatus.InProgress
              ? "In Progress"
              : row.bidStatus}
          </Badge>
        </Table.Td>
        <Table.Td>{formatTime(row?.createdAt)}</Table.Td>
        <Table.Td>{formatTime(row?.item.expiresAt)}</Table.Td>
        {row.bidStatus === BidStatus.Won && (
          <Table.Td>
            <ActionIcon p="2px" onClick={() => openBill(row.item._id)}>
              <IconFileInvoice size="3.5rem" />
            </ActionIcon>
          </Table.Td>
        )}
      </Table.Tr>
    );
  });

  return (
    <Container m="xl" maw="100%">
      <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700}>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Item Name</Table.Th>
              <Table.Th>Item Price</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Bid Started On</Table.Th>
              <Table.Th>Closes At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <Modal opened={opened} onClose={close} centered title="Invoice">
        <Bill userId={user?._id ?? ""} itemId={itemId} />
      </Modal>
    </Container>
  );
};

export default ProfilePage;
