import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";

const InlineInput = ({
  field,
  label,
  fieldTip,
  placeholder,
  isPassword,
  ...p
}) => (
  <InputGroup>
    {field.name && (
      <InputLeftAddon>
        <Text fontWeight="bold">{label}</Text>
      </InputLeftAddon>
    )}
    <Input
      {...field}
      id={field.name}
      placeholder={placeholder}
      type={isPassword ? "password" : "text"}
      // variant="filled"
      {...p}
    />
    {fieldTip}
  </InputGroup>
);

const LabelledInput = ({
  field,
  label,
  fieldTip,
  placeholder,
  isPassword,
  ...p
}) => (
  <>
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
  </>
);

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
  isInline,
  ...p
}) => (
  <FormControl
    isRequired={isRequired}
    isInvalid={errors[field.name] && touched[field.name]}
  >
    {isInline ? (
      <InlineInput
        field={field}
        label={label}
        fieldTip={fieldTip}
        placeholder={placeholder}
        isPassword={isPassword}
        {...p}
      />
    ) : (
      <LabelledInput
        field={field}
        label={label}
        fieldTip={fieldTip}
        placeholder={placeholder}
        isPassword={isPassword}
        {...p}
      />
    )}
    <FormErrorMessage>{errors[field.name]}</FormErrorMessage>
  </FormControl>
);

export default FormikInput;
