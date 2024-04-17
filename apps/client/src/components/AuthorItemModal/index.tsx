import {
  Button,
  Checkbox,
  FileInput,
  NumberInput,
  Paper,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { schema } from "./validationSchema";
import { UpdateItemDto } from "../../types";
import { useCreateItem } from "../../hooks/useCreateItem";
import { modifyFormData } from "../../utils";
import { useUpdateItem } from "../../hooks/useUpdateItem";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  mode: "create" | "edit";
  itemId?: string;
  close: () => void;
};

const AuthorItemModal = ({ mode, itemId, close }: Props) => {
  const queryClient = useQueryClient();
  const {
    mutate: createItemMutation,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
  } = useCreateItem();
  const {
    mutate: updateItemMutation,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateItem(itemId ?? "");
  const form = useForm<UpdateItemDto>({
    mode: "uncontrolled",
    initialValues: {
      name: undefined,
      description: undefined,
      price: undefined,
      image: undefined,
      expiresAt: undefined,
      isActive: undefined,
    },

    validate: mode === "create" ? zodResolver(schema) : undefined,
  });

  const handleSubmit = (formValues: UpdateItemDto) => {
    const newFormValues = modifyFormData(formValues);
    if (mode === "create") {
      createItemMutation(newFormValues);
      return;
    }
    updateItemMutation(newFormValues);
  };

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      close();
      queryClient.invalidateQueries({ queryKey: ["auctionItems"] });
    }
  }, [isCreateSuccess, isUpdateSuccess, close, queryClient]);

  return (
    <Paper component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        required={mode === "create" ? true : false}
        {...form.getInputProps("name")}
        error={form.errors.name}
        onBlur={form.resetTouched}
      />
      <TextInput
        label="Description"
        required={mode === "create" ? true : false}
        {...form.getInputProps("description")}
        error={form.errors.description}
        onBlur={form.resetTouched}
      />
      <NumberInput
        label="Price"
        prefix="$"
        allowDecimal={false}
        min={1}
        required={mode === "create" ? true : false}
        {...form.getInputProps("price")}
        error={form.errors.price}
        onBlur={form.resetTouched}
      />
      <FileInput
        label="Image"
        accept="image/png,image/jpeg"
        required={mode === "create" ? true : false}
        placeholder="Pick an image"
        {...form.getInputProps("image")}
        error={form.errors.image}
        onBlur={form.resetTouched}
      />
      <DateTimePicker
        valueFormat="DD MMM, YYYY hh:mm A"
        label="Deadline"
        placeholder="Pick date and time"
        {...form.getInputProps("expiresAt")}
        required={mode === "create" ? true : false}
        error={form.errors.expiresAt}
        onBlur={form.resetTouched}
      />
      {mode === "edit" && (
        <Checkbox
          label="Is item on auction?"
          my="xs"
          {...form.getInputProps("isActive", { type: "checkbox" })}
        />
      )}
      <Button
        fullWidth
        mt="xl"
        type="submit"
        loading={isCreatePending || isUpdatePending}
      >
        {mode === "create" ? "Create" : "Update"}
      </Button>
    </Paper>
  );
};

export default AuthorItemModal;
