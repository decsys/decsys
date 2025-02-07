import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import FormikInput from "components/core/FormikInput";
import StandardModal from "components/core/StandardModal";
import { Field, Form, Formik } from "formik";
import "github-markdown-css";
import ReactMarkdown from "react-markdown";
import { capitalise } from "services/strings";
import { object, string } from "yup";

// There are a number of ways to create a survey: Blank, Import, Duplicate etc.
// But they also all require some common follow up information
// This modal gathers that information and then executes a handler
// that accepts the new information, and deals with the previously chosen type of creation

const validationSchema = object().shape({
  type: string().oneOf(["", "prolific"]),
});

const SetupGuideLinkAlert = ({ type }) => {
  return !!type ? (
    <Alert status="info">
      <AlertIcon />

      <Stack>
        <Text>
          {capitalise(type)} Surveys require some further setup after creation.
        </Text>
        <Text as="div" className="markdown-body">
          <ReactMarkdown
            source={`For assistance, view the
          **${capitalise(
            type
          )}** [Setup Guide](/docs/users/integrations/${type})
          `}
          />
        </Text>
      </Stack>
    </Alert>
  ) : null;
};

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
  parentFolderName,
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
    await onCreate(
      name,
      type,
      settings,
      {
        isStudy,
        parentId,
      },
      parentFolderName
    );
    actions.setSubmitting(false);
    actions.resetForm();
    modalState.onClose();
  };

  return (
    <Formik
      initialValues={{
        name: defaultName,
        type: defaultType,
        ...defaultSettings,
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
              <SetupGuideLinkAlert type={values.type} />
            </Stack>
          </Form>
        </StandardModal>
      )}
    </Formik>
  );
};

export { CreateSurveyModal };
