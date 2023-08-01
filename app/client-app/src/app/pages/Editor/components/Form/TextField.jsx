import { VStack } from "@chakra-ui/react";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { FormikInput } from "./FormikInput";
import { useDebounce } from "../Helpers/useDebounce";

export const TextField = ({ name, header, ...p }) => {
  const [field, meta, helpers] = useField({ name, type: "text" });

  const [value, setValue] = useState(field.value);
  const debouncedValue = useDebounce(value, 150);

  useEffect(() => {
    helpers.setValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <VStack align="start" w="100%" spacing={2}>
      <FormikInput
        name={name}
        placeholder="Name"
        size="sm"
        onChange={setValue}
        value={value}
        collapseError
        isInvalid={meta.error && meta.touched}
        error={meta.error}
        {...p}
      />
    </VStack>
  );
};
