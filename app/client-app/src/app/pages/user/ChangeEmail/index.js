import { Stack, Flex, Button, Alert, AlertIcon, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { Page } from "components/core";
import { useState } from "react";
import LightHeading from "components/core/LightHeading";
import validationSchema from "./validation";
import { requestEmailChange } from "api/account";
import ErrorsAlert from "components/core/ErrorsAlert";
import EmailFieldGroup from "../components/EmailFieldGroup";

const SuccessAlert = () => (
  <Alert status="success">
    <AlertIcon />
    <Stack spacing={2} w="100%">
      <Text>An confirmation email has been sent to the new email address.</Text>
      <Text>
        Please check your email, and click the link within to confirm your email
        address and complete the change.
      </Text>
    </Stack>
  </Alert>
);

const ChangeEmail = () => {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, actions) => {
    try {
      const { errors } = await requestEmailChange(values);
      setErrors(errors);
      if (!errors?.length) {
        setSuccess(true);
        actions.resetForm();
      }
    } catch (e) {
      console.error(e);
      setErrors([e.message]);
    }
    actions.setSubmitting(false);
  };

  return (
    <Page layout="manageAccount">
      <Stack mt={4} w="100%" spacing={4}>
        <LightHeading>Change Password</LightHeading>

        {success && <SuccessAlert />}

        <ErrorsAlert
          errors={errors}
          title="There was an error with your form submission:"
          shouldCollapseSingles
        />

        <Alert>
          <AlertIcon />
          Enter and confirm a new email address to request a change.
        </Alert>

        <Formik
          initialValues={{
            Email: "",
            EmailConfirm: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Stack spacing={4}>
                <EmailFieldGroup />

                <Flex justify="flex-start">
                  <Button
                    width="3xs"
                    colorScheme="blue"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Request Email Change
                  </Button>
                </Flex>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Page>
  );
};

export default ChangeEmail;
