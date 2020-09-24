import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import { Flex, Stack, Button, Alert, AlertIcon } from "@chakra-ui/core";
import React from "react";
import { navigate } from "@reach/router";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form } from "formik";
import { EmailField } from "../components/EmailFieldGroup";
import validationSchema from "./validation";

const ForgotPassword = () => {
  const handleCancel = () => navigate(-1);
  const handleSubmit = (values, actions) => {
    postObjectAsFormData("/account/password/reset", values);
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Forgotten Password</LightHeading>

          <Formik
            initialValues={{ Email: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={4}>
                  <Alert>
                    <AlertIcon />
                    Enter your email address to request a password reset link.
                  </Alert>

                  <EmailField />

                  <Flex justify="space-between">
                    <Button
                      width="3xs"
                      colorScheme="blue"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Request Link
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

export default ForgotPassword;
