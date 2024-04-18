import {
  Button,
  Center,
  NumberInput,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchUserAutobidConfig from "../../hooks/useFetchUserAutobidConfig";
import useSetUserAutobidConfig from "../../hooks/useSetUserAutobidConfig";

const AutobidConfigPage = () => {
  const { id } = useParams();
  const {
    data: config,
    isLoading,
    isError,
  } = useFetchUserAutobidConfig(id ?? "");
  const [amount, setAmount] = useState(config?.maxBidAmount ?? 1);
  const [percentage, setPercentage] = useState(config?.autoBidPercentage ?? 1);
  const { mutate } = useSetUserAutobidConfig(id ?? "", amount, percentage);

  if (isError) {
    return <div>Something went wrong</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Center mt="5rem">
      <Paper withBorder radius="lg" shadow="xl" maw="70%" p="lg">
        <Stack gap="lg">
          <Title ta="center" fz="h2">
            Configure Bidding Settings
          </Title>
          <NumberInput
            label="Your max amount"
            prefix="$"
            allowDecimal={false}
            min={1}
            required
            value={amount}
            placeholder={config?.maxBidAmount?.toString()}
            onChange={(e) => setAmount(e as number)}
          />
          <NumberInput
            label="Alert percentage"
            suffix="%"
            allowDecimal={false}
            min={1}
            max={100}
            required
            value={percentage}
            placeholder={config?.autoBidPercentage?.toString()}
            onChange={(e) => setPercentage(e as number)}
          />
          <Button fullWidth onClick={() => mutate()}>
            Submit
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default AutobidConfigPage;
