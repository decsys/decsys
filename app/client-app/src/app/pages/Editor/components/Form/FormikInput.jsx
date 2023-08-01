import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaRegCopy } from "react-icons/fa";
import { FormHelpError } from "./FormHelpError";
import { useDebounce } from "../Helpers/useDebounce";

export const FormikInput = ({
  name,
  label,
  placeholder,
  type = "text",
  isRequired,
  fieldTip,
  fieldHelp,
  collapseError,
  isDisable,
  ...p
}) => {
  const toast = useToast();
  const [field, meta, helpers] = useField({ name, type });

  const [isMasked, setIsMasked] = useState(type === "password");

  const [value, setValue] = useState(field.value);
  const debouncedValue = useDebounce(value, 150);

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };

  useEffect(() => {
    helpers.setValue(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const inputField = (
    <Input
      disabled={isDisable || type === "readOnly"}
      type={isMasked ? "password" : type === "password" ? "text" : type}
      placeholder={placeholder}
      {...p}
      value={value}
      onChange={handleChange}
      onBlur={type === "email" ? field.onBlur : undefined}
    />
  );

  const onClickCopyToClipboard = (value) => {
    // handle copy to clipboard action
    navigator.clipboard.writeText(value);
    toast({
      position: "top",
      title: "Copied to clipboard",
      status: "success",
      duration: 700,
      isClosable: true,
    });
  };

  return (
    <FormControl
      id={field.name}
      isRequired={isRequired}
      isInvalid={meta.error && meta.touched}
    >
      {label && <FormLabel>{label}</FormLabel>}

      {type === "password" || type === "readOnly" ? (
        <InputGroup>
          {inputField}
          {type == "password" ? (
            <InputLeftElement>
              <IconButton
                variant="solid"
                onClick={() => setIsMasked(!isMasked)}
                size="md"
                icon={isMasked ? <FaEye /> : <FaEyeSlash />}
              />
            </InputLeftElement>
          ) : (
            value && (
              <InputRightElement>
                <IconButton
                  variant="solid"
                  onClick={() => onClickCopyToClipboard(value)}
                  size="md"
                  icon={<FaRegCopy />}
                />
              </InputRightElement>
            )
          )}
        </InputGroup>
      ) : (
        inputField
      )}

      {fieldTip}

      <FormHelpError
        isInvalid={meta.error && meta.touched}
        error={meta.error}
        help={fieldHelp}
        collapseEmpty={collapseError}
        replaceHelpWithError
      />
    </FormControl>
  );
};
