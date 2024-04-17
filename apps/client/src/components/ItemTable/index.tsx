import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Button,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconCirclePlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "./ItemTable.module.css";
import { AuctionItem } from "../../types";
import { useDeleteItem } from "../../hooks/useDeleteItem";
import { useQueryClient } from "@tanstack/react-query";
import AuthorItemModal from "../AuthorItemModal";
import { SetURLSearchParams } from "react-router-dom";

type TableProps = {
  data: AuctionItem[];
  setSearchParams: SetURLSearchParams;
  searchParams: URLSearchParams;
};
interface ThProps {
  children?: React.ReactNode;
  order?: string | null;
  sorted?: boolean;
  onSort?: () => void;
}

function Th({ children, order, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? order === "ASC"
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export function ItemTable({ data, searchParams, setSearchParams }: TableProps) {
  const queryClient = useQueryClient();
  const { isSuccess, mutate } = useDeleteItem();
  const [sorted, setSorted] = useState(false);
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [itemId, setItemId] = useState("");

  const handleEdit = (id: string) => {
    setItemId(id);
    openEditModal();
  };

  const onSort = () => {
    setSorted(true);
    setSearchParams((prev) => {
      prev.set("order", prev.get("order") === "DESC" ? "ASC" : "DESC");
      return prev;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      prev.set("filter", e.target.value);
      return prev;
    });
  };

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["auctionItems"] });
    }
  }, [isSuccess, queryClient]);

  const rows = data.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{row.isActive.toString()}</Table.Td>
      <Table.Td>{dayjs(row.expiresAt).format("DD MMM, YYYY hh:mm A")}</Table.Td>
      <Table.Td>${row.price}</Table.Td>
      <Table.Td>
        <Group gap="md">
          <ActionIcon
            style={{ background: "transparent" }}
            onClick={() => handleEdit(row._id)}
          >
            <IconPencil size="1.2rem" color="green" />
          </ActionIcon>
          <ActionIcon
            style={{ background: "transparent" }}
            onClick={() => mutate(row._id)}
          >
            <IconTrash size="1.2rem" color="red" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea my="xl">
      <Group gap="md" align="center" py="md">
        <TextInput
          flex={1}
          placeholder="Search by name or description"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          className={classes.root}
          value={searchParams.get("filter") || ""}
          onChange={handleSearchChange}
        />
        <Button leftSection={<IconCirclePlus />} onClick={openCreateModal}>
          Create New Item
        </Button>
      </Group>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Deadline</Table.Th>
            <Th
              onSort={onSort}
              sorted={sorted}
              order={searchParams.get("order")}
            >
              Price
            </Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Create Item"
        centered
      >
        <AuthorItemModal mode="create" close={closeCreateModal} />
      </Modal>
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Item"
        centered
      >
        <AuthorItemModal mode="edit" itemId={itemId} close={closeEditModal} />
      </Modal>
    </ScrollArea>
  );
}
