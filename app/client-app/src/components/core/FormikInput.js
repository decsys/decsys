import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/core";

/**
 * Should account for 90% of text inputs inside Formik Fields.
 *
 * - Sets Input element id to the field name
 * - Has a label, indicating required status
 * - Allows text or password fields
 * - Uses placeholder text
 * - Displays validation errors
 * - Allows an optional `fieldTip` (e.g. a Popover)
 * - forwards all other props to <Input />
 *
 * @param {*} props render props from Formik Field, and additional props
 */
const FormikInput = ({
  field,
  form: { errors, touched },
  label,
  placeholder,
  isPassword = false,
  isRequired = false,
  fieldTip,
  ...p
}) => (
  <FormControl
    isRequired={isRequired}
    isInvalid={errors[field.name] && touched[field.name]}
  >
    <Flex justify="space-between">
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {fieldTip}
    </Flex>
    <Input
      {...field}
      id={field.name}
      placeholder={placeholder}
      type={isPassword ? "password" : "text"}
      {...p}
    />
    <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
  </FormControl>
);

export default FormikInput;
