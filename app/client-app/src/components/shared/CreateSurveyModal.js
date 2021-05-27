import { Stack } from "@chakra-ui/react";
import FormikInput from "components/core/FormikInput";
import StandardModal from "components/core/StandardModal";
import { Field, Form, Formik } from "formik";

// There are a number of ways to create a survey: Blank, Import, Duplicate etc.
// But they also all require some common follow up information
// This modal gathers that information and then executes a handler
// that accepts the new information, and deals with the previously chosen type of creation
const CreateSurveyModal = ({ name, onCreate, modalState }) => {
  const defaultName = name ?? "";

  const handleSubmit = (values, actions) => {
    const { name, type, ...settings } = values;
    onCreate(name, type, settings);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ name: defaultName }}
      enableReinitialize
      onSubmit={handleSubmit}
      //validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <StandardModal
          size="lg"
          {...modalState}
          header="New Survey details"
          confirmButton={{
            colorScheme: "green",
            children: "Create survey",
            onClick: handleSubmit,
            type: "submit",
            disabled: isSubmitting,
          }}
        >
          <Form noValidate>
            <Stack spacing={4}>
              <Field name="name">
                {(rp) => (
                  <FormikInput
                    {...rp}
                    label="Survey Name"
                    placeholder="Untitled Survey"
                  />
                )}
              </Field>
            </Stack>
          </Form>
        </StandardModal>
      )}
    </Formik>
  );
};

export { CreateSurveyModal };
