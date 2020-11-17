import React, { useState } from "react";
import { Field } from "formik";
import { Flex } from "@chakra-ui/react";
import FormikInput from "components/core/FormikInput";

export const EmailField = ({ name = "Email", ...p }) => (
  <Field name={name}>
    {(rp) => (
      <FormikInput
        {...rp}
        label="Email Address"
        placeholder="john.smith@example.com"
        isRequired
        {...p}
      />
    )}
  </Field>
);

const EmailFieldGroup = ({ initialHidden }) => {
  const [hidden, setHidden] = useState(initialHidden);
  const handleFocus = () => setHidden(false);

  return (
    <>
      <EmailField onFocus={handleFocus} />

      <Flex hidden={hidden}>
        <EmailField name="EmailConfirm" label="Confirm Email Address" />
      </Flex>
    </>
  );
};

export default EmailFieldGroup;
