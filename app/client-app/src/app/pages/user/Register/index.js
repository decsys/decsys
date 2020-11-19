import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Flex, Alert, AlertIcon } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import FormikInput from "components/core/FormikInput";
import validationSchema from "./validation";
import { navigate } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { useServerConfig } from "api/config";
import Error from "app/pages/Error";
import ErrorsAlert from "components/core/ErrorsAlert";
import { ApprovalRequired, EmailConfirmationRequired } from "./alerts";
import {
  REQUIRES_APPROVAL,
  REQUIRES_EMAIL_CONFIRMATION,
} from "constants/account-states";
import EmailFieldGroup from "../components/EmailFieldGroup";
import PasswordFieldGroup from "../components/PasswordFieldGroup";

const Feedback = ({ errors, accountState, Email }) => {
  switch (accountState) {
    case REQUIRES_EMAIL_CONFIRMATION:
      return <EmailConfirmationRequired Email={Email} />;
    case REQUIRES_APPROVAL:
      return <ApprovalRequired />;
    default:
      return (
        <ErrorsAlert
          errors={errors}
          title="There was an error with your form submission:"
          shouldCollapseSingles
        />
      );
  }
};

const Register = () => {
  const {
    errors,
    Email,
    EmailConfirm,
    Fullname,
    accountState,
  } = useQueryStringViewModel();
  const { allowRegistration, accountApprovalRequired } = useServerConfig();

  if (!allowRegistration)
    return <Error message="Account Registration is not enabled" />;

  const post = (values) => {
    postObjectAsFormData("/Account/Register", values);
  };

  const handleCancel = () => navigate(-1);
  const handleSubmit = (values, actions) => {
    post(values);
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Register</LightHeading>

          <Feedback accountState={accountState} errors={errors} Email={Email} />

          {accountApprovalRequired && (
            <Alert status="info">
              <AlertIcon />
              Account registrations are subject to approval.
            </Alert>
          )}

          <Formik
            initialValues={{
              Fullname,
              Email,
              EmailConfirm,
              Password: "",
              PasswordConfirm: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={4}>
                  <Field name="Fullname">
                    {(rp) => (
                      <FormikInput
                        {...rp}
                        label="Full Name"
                        placeholder="John Smith"
                        isRequired
                      />
                    )}
                  </Field>

                  <EmailFieldGroup initialHidden={!errors} />

                  <PasswordFieldGroup initialHidden={!errors} />

                  <Flex justify="space-between">
                    <Button
                      width="3xs"
                      colorScheme="blue"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                    <Button width="3xs" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Flex>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Flex>
    </Page>
  );
};

export default Register;
