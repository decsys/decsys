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

const Login = () => {
  const { ReturnUrl, ViewModel } = useQueryString();
  const { errors, Username } = Base64UrlToJson(ViewModel) ?? {};
  const { allowRegistration } = useServerConfig();

  const post = (values) => {
    postObjectAsFormData("/Account/Login", {
      ...values,
      returnUrl: ReturnUrl,
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

          <ErrorsAlert
            errors={errors}
            title="There was an error with your form submission:"
            shouldCollapseSingles
          />

          <Formik
            initialValues={{ Username }}
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
