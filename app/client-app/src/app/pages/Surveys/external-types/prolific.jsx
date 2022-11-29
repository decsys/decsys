import { Stack } from "@chakra-ui/react";
import { Field } from "formik";
import FormikInput from "components/core/FormikInput";
import { object, string } from "yup";

export const ProlificSettings = () => {
  return (
    <Stack>
      <Field name="CompletionUrl">
        {(rp) => (
          <FormikInput {...rp} label="Completion URL" isInline isRequired />
        )}
      </Field>
    </Stack>
  );
};

export const prolificValidationSchema = object().shape({
  CompletionUrl: string().required(
    "Prolific Surveys require a Completion URL."
  ),
});

export const prolificInitialValues = {
  CompletionUrl: "",
};
