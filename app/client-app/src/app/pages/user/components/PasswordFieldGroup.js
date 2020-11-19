import React, { useState } from "react";
import { Field } from "formik";
import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Link,
} from "@chakra-ui/react";
import FormikInput from "components/core/FormikInput";

const passwordRequirements = [
  "Passwords must be at least 6 characters.",
  "Passwords must have at least one digit ('0' - '9').",
  "Passwords must have at least one uppercase ('A' - 'Z').",
  "Passwords must have at least one non alphanumeric character.",
];

const PasswordRequirementsTip = () => (
  <Popover returnFocusOnClose={false} usePortal>
    <PopoverTrigger>
      <Link color="blue.500" href="#">
        Password Requirements
      </Link>
    </PopoverTrigger>
    <PopoverContent bg="gray.300" borderColor="gray.400">
      <PopoverArrow />
      <PopoverBody pl={8}>
        <ul>
          {passwordRequirements.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export const PasswordField = ({ name = "Password", ...p }) => (
  <Field name={name}>
    {(rp) => (
      <FormikInput
        {...rp}
        label="Password"
        placeholder="Password"
        isRequired
        isPassword
        {...p}
      />
    )}
  </Field>
);

const PasswordFieldGroup = ({
  initialHidden,
  primaryProps = {},
  confirmProps = {},
}) => {
  const [hidden, setHidden] = useState(initialHidden);
  const handleFocus = () => setHidden(false);

  return (
    <>
      <PasswordField
        fieldTip={<PasswordRequirementsTip />}
        onFocus={handleFocus}
        {...primaryProps}
      />

      <Flex hidden={hidden}>
        <PasswordField
          name="PasswordConfirm"
          label="Confirm Password"
          {...confirmProps}
        />
      </Flex>
    </>
  );
};

export default PasswordFieldGroup;
