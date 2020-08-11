import React from "react";
import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Flex, Alert, AlertIcon } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import FormikInput from "components/core/FormikInput";
import validationSchema from "./validation";
import { useLocation } from "@reach/router";
import queryString from "query-string";
import { Base64UrlToUtf8 } from "services/data-structures";

const Login = () => {
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const error = Base64UrlToUtf8(queryParams.Error);
  const username = Base64UrlToUtf8(queryParams.Username);

  const post = (values) => {
    postObjectAsFormData("/Account/Login", {
      ...values,
      returnUrl: queryParams.ReturnUrl,
    });
  };

  const handleCancel = () => post({ button: "" });
  const handleSubmit = (values, actions) => {
    post({ ...values, button: "login" });
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Login</LightHeading>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              Username: username ?? "",
              Password: "",
            }}
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
        </Stack>
      </Flex>
    </Page>
  );
};

export default Login;
