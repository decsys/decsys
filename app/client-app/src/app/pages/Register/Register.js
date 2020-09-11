import React from "react";
import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Flex, Alert, AlertIcon } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import FormikInput from "components/core/FormikInput";
import validationSchema from "./validation";
import { navigate } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { useServerConfig } from "api/config";
import Error from "../Error";

const Register = () => {
  const { error, username, fullname } = useQueryStringViewModel();
  const { allowRegistration } = useServerConfig();
  if (!allowRegistration)
    return <Error message="Account Registration is not enabled" />;

  const post = (values) => {
    postObjectAsFormData("/Account/Register", {
      ...values,
    });
  };

  const handleCancel = () => navigate(-1);
  const handleSubmit = (values, actions) => {
    post({ ...values, button: "login" });
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Register</LightHeading>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              Fullname: fullname ?? "",
              Username: username ?? "",
              Password: "",
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
