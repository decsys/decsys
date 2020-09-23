import React from "react";
import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Flex, Link, Text } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import FormikInput from "components/core/FormikInput";
import validationSchema from "./validation";
import { Link as RouterLink } from "@reach/router";
import { useQueryString } from "hooks/useQueryString";
import { Base64UrlToJson } from "services/data-structures";
import { useServerConfig } from "api/config";
import ErrorsAlert from "components/core/ErrorsAlert";
import { ApprovalRequired, EmailConfirmationRequired } from "./alerts";
import { useAuth } from "auth/AuthContext";
import Loading from "../Loading";
import {
  REQUIRES_APPROVAL,
  REQUIRES_EMAIL_CONFIRMATION,
} from "constants/account-states";

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

const Login = () => {
  const { login } = useAuth();
  const { ReturnUrl, ViewModel } = useQueryString();
  const { Username, ...vmFeedback } = Base64UrlToJson(ViewModel) ?? {};
  const { allowRegistration } = useServerConfig();

  // This form wasn't triggered though oidc-client?
  // fix it by invoking oidc-client now
  if (!ReturnUrl) {
    login({ returnUrl: "" });
    return <Loading />;
  }

  const post = (values) => {
    postObjectAsFormData("/Account/Login", {
      ...values,
      returnUrl: ReturnUrl,
    });
  };

  const handleCancel = () =>
    post({ button: "cancel", Username: "x", Password: "x" }); // gotta pass model validation
  const handleSubmit = (values, actions) => {
    post({ ...values, button: "login" });
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Login</LightHeading>

          <Feedback {...vmFeedback} Email={Username} />

          <Formik
            initialValues={{ Username, Password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={4}>
                  <Field name="Username">
                    {(rp) => (
                      <FormikInput
                        {...rp}
                        label="Email Address"
                        placeholder="john.smith@example.com"
                        isRequired
                      />
                    )}
                  </Field>

                  <Field name="Password">
                    {(rp) => (
                      <FormikInput
                        {...rp}
                        label={rp.field.name}
                        placeholder={rp.field.name}
                        isRequired
                        isPassword
                      />
                    )}
                  </Field>

                  <Flex justify="space-between">
                    <Button
                      width="3xs"
                      colorScheme="blue"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                    <Button width="3xs" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Flex>
                </Stack>
              </Form>
            )}
          </Formik>

          {allowRegistration && (
            <Stack direction="row">
              <Text>Don't have an account yet?</Text>
              <Link color="blue.500" as={RouterLink} to="/user/register">
                Register
              </Link>
            </Stack>
          )}
        </Stack>
      </Flex>
    </Page>
  );
};

export default Login;
