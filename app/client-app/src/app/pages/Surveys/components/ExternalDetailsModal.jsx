import { cloneElement } from "react";
import { StandardModal } from "components/core";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { capitalise } from "services/strings";
import LightHeading from "components/core/LightHeading";
import { CopyableTextPanel } from "components/core/CopyableTextPanel";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";
import { encode } from "services/instance-id";
import { Formik } from "formik";
import {
  getInitialValues,
  getValidationSchema,
  EditableSettings,
} from "../external-types";
import { useSurveyCardActions } from "../contexts/SurveyCardActions";

/**
 * Build the external survey link based on survey id.
 * In future this may differ based on external type
 * @param {*} id
 * @returns
 */
const getExternalSurveyUrl = (id) =>
  `${window.location.origin.replace(
    "localhost",
    "<ip-address>"
  )}/survey/${encode(id)}`;

/**
 * Provide conditional advice about IP addresses if the URL
 * expects a local ip address
 * @param {*} url
 * @returns
 */
const IpAddressWarning = ({ url }) => {
  return url?.includes("<ip-address>") ? (
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
  ) : null;
};

const SetupGuideLinkAlert = ({ type }) => {
  return !!type ? (
    <Alert status="info">
      <AlertIcon />

      <Text as="div" className="markdown-body">
        <ReactMarkdown
          source={`For assistance, view the
**${capitalise(type)}** [Setup Guide](/docs/users/integrations/${type})
  `}
        />
      </Text>
    </Alert>
  ) : null;
};

const InvalidExternalLinkAlert = () => (
  <Alert status="warning">
    <AlertIcon />
    <Stack>
      <AlertTitle>This Survey's external link is broken</AlertTitle>
      <AlertDescription>
        Another newer DECSYS Survey was created with the same External Survey
        ID, breaking the link to this Survey.
      </AlertDescription>
    </Stack>
  </Alert>
);

const ModalBody = ({
  id,
  modalState,
  settings,
  name,
  type,
  hasInvalidExternalLink,
  runCount,
  formProps,
}) => {
  if (!type) return null;

  const externalSurveyUrl = getExternalSurveyUrl(id);

  return (
    <StandardModal
      size="2xl"
      {...modalState}
      header={`Survey details`}
      confirmButton={
        !runCount && {
          colorScheme: "green",
          children: `Save Settings`,
          onClick: formProps.submitForm,
          type: "submit",
          disabled: formProps.isSubmitting,
          isLoading: formProps.isSubmitting,
        }
      }
      cancelButton={
        !runCount && {
          onClick: () => {
            formProps.resetForm();
            modalState.onClose();
          },
        }
      }
    >
      <Stack w="100%" spacing={2} mb={3}>
        <Stack w="100%" pl={2}>
          <SetupGuideLinkAlert type={type} />
          <CopyableTextPanel label="Survey Name" value={name} />

          <IpAddressWarning url={externalSurveyUrl} />
          <CopyableTextPanel label="Access URL" value={externalSurveyUrl} />
        </Stack>

        <LightHeading size="md">{capitalise(type)} Settings</LightHeading>
        <Stack w="100%" pl={2}>
          {hasInvalidExternalLink && <InvalidExternalLinkAlert />}
          {runCount ? (
            Object.keys(settings).map((k) => (
              <CopyableTextPanel key={k} label={k} value={settings[k]} />
            ))
          ) : (
            <EditableSettings type={type} {...formProps} />
          )}
        </Stack>
      </Stack>
    </StandardModal>
  );
};

const ExternalDetailsModal = ({
  id,
  modalState,
  settings = {},
  name,
  type,
  hasInvalidExternalLink,
  runCount,
}) => {
  const { saveSettings } = useSurveyCardActions();
  const handleSubmit = async (values, actions) => {
    await saveSettings(id, values);
    actions.setSubmitting(false);
    actions.resetForm();
    modalState.onClose();
  };

  const modalBody = (
    <ModalBody
      id={id}
      modalState={modalState}
      settings={settings}
      name={name}
      type={type}
      hasInvalidExternalLink={hasInvalidExternalLink}
      runCount={runCount}
    />
  );

  return runCount ? (
    modalBody
  ) : (
    <Formik
      initialValues={{
        ...getInitialValues(type),
        ...settings, // these may override some of the empty strings above
      }}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={getValidationSchema(type)}
    >
      {(formProps) => cloneElement(modalBody, { formProps })}
    </Formik>
  );
};

export { ExternalDetailsModal };
