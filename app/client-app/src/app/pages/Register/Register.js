import React, { useState } from "react";
import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import { Formik, Form, Field } from "formik";
import {
  Stack,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Link,
} from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import FormikInput from "components/core/FormikInput";
import validationSchema from "./validation";
import { navigate } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { useServerConfig } from "api/config";
import Error from "../Error";
import ErrorsAlert from "components/core/ErrorsAlert";

// TODO: this will later want to be reusable for email change
const EmailFieldGroup = ({ initialHidden }) => {
  const [hidden, setHidden] = useState(initialHidden);
  const handleFocus = () => setHidden(false);

  return (
    <>
      <Field name="Email">
        {(rp) => (
          <FormikInput
            {...rp}
            label="Email Address"
            placeholder="john.smith@example.com"
            isRequired
            onFocus={handleFocus}
          />
        )}
      </Field>

      <Flex hidden={hidden}>
        <Field name="EmailConfirm">
          {(rp) => (
            <FormikInput
              {...rp}
              label="Confirm Email Address"
              placeholder="john.smith@example.com"
              isRequired
            />
          )}
        </Field>
      </Flex>
    </>
  );
};

// TODO: this will later want to be reusable for password reset
const PasswordFieldGroup = ({ initialHidden }) => {
  const [hidden, setHidden] = useState(initialHidden);
  const handleFocus = () => setHidden(false);

  const tip = (
    <Popover returnFocusOnClose={false} usePortal>
      <PopoverTrigger>
        <Link color="blue.500" href="#">
          Password Requirements
        </Link>
      </PopoverTrigger>
      <PopoverContent bg="gray.300" borderColor="gray.400">
        <PopoverArrow />
        <PopoverBody pl={8}>
          <ul>
            <li>Passwords must be at least 6 characters.</li>
            <li>Passwords must have at least one digit ('0' - '9').</li>
            <li>Passwords must have at least one uppercase ('A' - 'Z').</li>
            <li>
              Passwords must have at least one non alphanumeric character.
            </li>
          </ul>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <Field name="Password">
        {(rp) => (
          <FormikInput
            {...rp}
            label={rp.field.name}
            placeholder={rp.field.name}
            isRequired
            isPassword
            fieldTip={tip}
            onFocus={handleFocus}
          />
        )}
      </Field>

      <Flex hidden={hidden}>
        <Field name="PasswordConfirm">
          {(rp) => (
            <FormikInput
              {...rp}
              label="Confirm Password"
              placeholder="Password"
              isRequired
              isPassword
            />
          )}
        </Field>
      </Flex>
    </>
  );
};

const Register = () => {
  const { errors, Email, EmailConfirm, Fullname } = useQueryStringViewModel();
  const { allowRegistration } = useServerConfig();

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

          <ErrorsAlert
            errors={errors}
            title="There was an error with your form submission:"
            shouldCollapseSingles
          />

          <Formik
            initialValues={{
              Fullname,
              Email,
              EmailConfirm,
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
