import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Text,
  UnorderedList,
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
import { CopyableTextPanel } from "components/core/CopyableTextPanel";

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

const SetupGuide = ({ markdown, surveyUrl }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack
      bg="gray.200"
      borderRadius={5}
      alignItems="center"
      spacing={0}
      boxShadow=""
    >
      <Flex p={2} onClick={onToggle} cursor="pointer" align="center" w="100%">
        <Icon mr={2} as={isOpen ? FaChevronDown : FaChevronRight} />
        <Heading size="sm">Setup Guide</Heading>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack p={2}>
          {surveyUrl?.includes("<ip-address>") && (
            <Alert status="warning">
              <AlertIcon />

              <Text as="div" className="markdown-body">
                <ReactMarkdown
                  source={`
Since you're running in **Workshop Mode**, you'll need to provide
an ip address where your machine can access DECSYS, such as
\`127.0.0.1\`
            `}
                />
              </Text>
            </Alert>
          )}
          <CopyableTextPanel
            buttonScheme="blue"
            label="Access URL"
            value={surveyUrl}
          />
        </Stack>

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

const prolificInstructions = `
1. Create your study in [Prolific]("https://prolific.co")
1. Provide the **Access URL** (above)
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

const CreateSurveyModal = ({
  name,
  type,
  settings = {},
  onCreate,
  modalState,
  isFixedType,
  isStudy,
  parentId,
  hasFixedSettings,
}) => {
  const entityName = isStudy ? "Study" : "Survey";
  const defaultName = name ?? "";
  const defaultType = type ?? "";
  const defaultSettings = Object.keys(settings).reduce(
    (result, k) => ({
      ...result,
      [`${type}${k}`]: settings[k],
    }),
    {}
  );

  const handleSubmit = async (values, actions) => {
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
    await onCreate(name, type, settings, {
      isStudy,
      parentId,
    });
    actions.setSubmitting(false);
    actions.resetForm();
    modalState.onClose();
  };

  const externalSurveyUrl = `${window.location.origin.replace(
    "localhost",
    "<ip-address>"
  )}/survey`;

  return (
    <Formik
      initialValues={{
        name: defaultName,
        type: defaultType,
        prolificStudyId: "",
        prolificCompletionUrl: "",
        ...defaultSettings, // these may override some of the empty strings above
      }}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, values, submitForm, resetForm }) => (
        <StandardModal
          size="2xl"
          {...modalState}
          header={`New ${entityName} details`}
          confirmButton={{
            colorScheme: "green",
            children: `Create ${entityName.toLocaleLowerCase()}`,
            onClick: submitForm,
            type: "submit",
            disabled: isSubmitting,
            isLoading: isSubmitting,
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
              {(isFixedType || hasFixedSettings) && (
                <Alert status="info">
                  <AlertIcon />
                  <Stack>
                    <AlertTitle>Some settings are disabled</AlertTitle>
                    <AlertDescription>
                      <Stack>
                        <Text>
                          This can be due to several reasons, such as:
                        </Text>
                        <UnorderedList pl={10}>
                          <ListItem>
                            Importing Survey data along with structure.
                          </ListItem>
                          <ListItem>
                            Adding a Survey as the child of a Study
                          </ListItem>
                        </UnorderedList>
                      </Stack>
                    </AlertDescription>
                  </Stack>
                </Alert>
              )}

              <Field name="name">
                {(rp) => (
                  <FormikInput
                    {...rp}
                    label="Name"
                    placeholder={`Untitled ${entityName}`}
                  />
                )}
              </Field>

              <Field name="type">
                {({ field, form }) => {
                  const { onChange, ...rest } = field;
                  return (
                    <FormControl
                      isDisabled={isFixedType}
                      id={field.name}
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel htmlFor={field.name}>Access Type</FormLabel>
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
                  surveyUrl={externalSurveyUrl}
                  markdown={prolificInstructions}
                />
                <Field name="prolificStudyId">
                  {(rp) => (
                    <FormikInput
                      isDisabled={hasFixedSettings}
                      {...rp}
                      label="Study ID"
                    />
                  )}
                </Field>
                <Field name="prolificCompletionUrl">
                  {(rp) => (
                    <FormikInput
                      isDisabled={hasFixedSettings}
                      {...rp}
                      label="Completion URL"
                    />
                  )}
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
