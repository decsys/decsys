import { Stack, Flex, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { Page } from "components/core";
import { postObjectAsFormData } from "js-forms";
import React from "react";
import PasswordFieldGroup, {
  PasswordField,
} from "../components/PasswordFieldGroup";
import LightHeading from "components/core/LightHeading";
import { navigate } from "@reach/router";
import validationSchema from "./validation";

const ChangePassword = () => {
  const handleCancel = () => navigate(-1);
  const handleSubmit = (values, actions) => {
    postObjectAsFormData(`/account/password`, values);
    actions.setSubmitting(false);
  };

  return (
    <Page layout="manageAccount">
      <Stack mt={4} w="70%" spacing={4}>
        <LightHeading>Change Password</LightHeading>

        <Formik
          initialValues={{
            CurrentPassword: "",
            Password: "",
            PasswordConfirm: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Stack spacing={4}>
                <PasswordField
                  name="CurrentPassword"
                  label="Current Password"
                />

                <PasswordFieldGroup primaryName="New Password" />

                <Flex justify="space-between">
                  <Button
                    width="3xs"
                    colorScheme="blue"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Change Password
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
    </Page>
  );
};

export default ChangePassword;
