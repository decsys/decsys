import {
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import FormikInput from "components/core/FormikInput";
import StandardModal from "components/core/StandardModal";
import { Field, Form, Formik } from "formik";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { object, string } from "yup";

// There are a number of ways to create a survey: Blank, Import, Duplicate etc.
// But they also all require some common follow up information
// This modal gathers that information and then executes a handler
// that accepts the new information, and deals with the previously chosen type of creation

const validationSchema = object().shape({
  type: string().oneOf(["", "prolific"]),
  prolificStudyId: string().when("type", {
    is: (type) => type === "prolific",
    then: string().required("Prolific Surveys require a Study ID."),
  }),
  prolificCompletionUrl: string().when("type", {
    is: (type) => type === "prolific",
    then: string().required("Prolific Surveys require a Completion URL."),
  }),
});

const SetupGuide = ({ markdown }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack
      bg="gray.200"
      borderRadius={5}
      onClick={onToggle}
      alignItems="center"
      spacing={0}
      boxShadow=""
    >
      <Flex p={2} onClick={onToggle} cursor="pointer" align="center" w="100%">
        <Icon mr={2} as={isOpen ? FaChevronDown : FaChevronRight} />
        <Heading size="sm">Setup Guide</Heading>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Text pb={2} as="div" className="markdown-body">
          <ReactMarkdown
            plugins={[gfm]}
            linkTarget="_blank"
            source={markdown}
          />
        </Text>
      </Collapse>
    </Stack>
  );
};

const prolificInstructions = (surveyUrl) => `
1. Create your study in [Prolific]("https://prolific.co")
1. Provide the following survey url:
    - \`${surveyUrl}\`
1. When asked **"How do you want to record Prolific IDs?"**
    - Choose **"I'll use URL parameters"**
    - You can leave the default settings
1. When asked **"How do you want to confirm participants have completed your study?"**
    - Choose **"I'll redirect them using a URL"**
    - Copy the URL and enter it below for the **Completion URL**
1. Save your Prolific Study as a draft (this will generate its Study ID)
1. Copy *only* the Study ID from your browser address bar:
    - \`https://app.prolific.co/studies/<your-study-id-here>\`
    - Enter it below for the **Study ID**
    - This will link the Prolific Study to *this* DECSYS Survey
`;

const CreateSurveyModal = ({ name, onCreate, modalState }) => {
  const defaultName = name ?? "";

  const handleSubmit = (values, actions) => {
    let { name, type, ...settings } = values;

    // we do some pre-submissions massaging of the form values

    // coerce empty strings (used by formik for controlled inputs) to null
    // as the backend uses nullness for defaults
    name = name || null;
    type = type || null;

    // filter settings by type to simplify payloads
    settings = !type
      ? {}
      : Object.keys(settings).reduce(
          (o, k) =>
            settings[k] != null && settings[k] !== "" && k.startsWith(type)
              ? { ...o, [k.replace(type, "")]: settings[k] } // also trim the type prefix
              : o,
          {}
        );
    onCreate(name, type, settings);
    actions.setSubmitting(false);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{
        name: defaultName,
        type: "",
        prolificStudyId: "",
        prolificCompletionUrl: "",
      }}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, values, submitForm, resetForm }) => (
        <StandardModal
          size="2xl"
          {...modalState}
          header="New Survey details"
          confirmButton={{
            colorScheme: "green",
            children: "Create survey",
            onClick: submitForm,
            type: "submit",
            disabled: isSubmitting,
          }}
          cancelButton={{
            onClick: () => {
              resetForm();
              modalState.onClose();
            },
          }}
        >
          <Form noValidate css={{ width: "100%" }}>
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

              <Field name="type">
                {({ field, form }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormControl
                      id={field.name}
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel htmlFor={field.name}>Survey Type</FormLabel>
                      <RadioGroup id={field.name} {...rest}>
                        <Stack direction="row">
                          <Radio onChange={onChange} value="">
                            Standard
                          </Radio>

                          <Radio onChange={onChange} value="prolific">
                            Prolific.co
                          </Radio>
                        </Stack>
                        <FormErrorMessage>
                          {form.errors[field.name]}
                        </FormErrorMessage>
                      </RadioGroup>
                    </FormControl>
                  );
                }}
              </Field>

              <Stack hidden={values.type !== "prolific"}>
                <SetupGuide
                  markdown={prolificInstructions(
                    `${window.location.origin.replace(
                      "localhost",
                      "<ip-address>"
                    )}/ext`
                  )}
                />
                <Field name="prolificStudyId">
                  {(rp) => <FormikInput {...rp} label="Study ID" />}
                </Field>
                <Field name="prolificCompletionUrl">
                  {(rp) => <FormikInput {...rp} label="Completion URL" />}
                </Field>
              </Stack>
            </Stack>
          </Form>
        </StandardModal>
      )}
    </Formik>
  );
};

export { CreateSurveyModal };
