import { useEffect, useState } from "react";

import "./App.css";
import { DateTimePicker, DateValue } from "@mantine/dates";
import dayjs from "dayjs";

function App() {
  const [value, setValue] = useState<DateValue>();

  useEffect(() => {
    const niceFormat = dayjs(value).format("DD MMM, YYYY hh:mm A");
    const epochNumber = dayjs(niceFormat).valueOf();
    console.log({ niceFormat, epochNumber });
  }, [value]);

  return (
    <>
      <DateTimePicker
        valueFormat="DD MMM, YYYY hh:mm A"
        label="Pick date and time"
        placeholder="Pick date and time"
        value={value}
        onChange={setValue}
      />
    </>
  );
}

export default App;
