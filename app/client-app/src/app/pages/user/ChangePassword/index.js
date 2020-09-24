import { Stack, Flex, Button, useToast } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { Page } from "components/core";
import React, { useState } from "react";
import PasswordFieldGroup, {
  PasswordField,
} from "../components/PasswordFieldGroup";
import LightHeading from "components/core/LightHeading";
import { navigate } from "@reach/router";
import validationSchema from "./validation";
import { changePassword } from "api/account";
import ErrorsAlert from "components/core/ErrorsAlert";

const ChangePassword = () => {
  const toast = useToast();
  const [errors, setErrors] = useState(null);

  const handleCancel = () => navigate(-1);
  const handleSubmit = async (values, actions) => {
    try {
      const { errors } = await changePassword(values);
      setErrors(errors);
      if (!errors?.length) {
        toast({
          position: "top",
          title: "Pasword Changed.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        actions.resetForm();
      }
    } catch (e) {
      console.error(e);
      setErrors([e]);
    }
    actions.setSubmitting(false);
  };

  return (
    <Page layout="manageAccount">
      <Stack mt={4} w="70%" spacing={4}>
        <LightHeading>Change Password</LightHeading>

        <ErrorsAlert
          errors={errors}
          title="There was an error with your form submission:"
          shouldCollapseSingles
        />

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

                <PasswordFieldGroup primaryProps={{ label: "New Password" }} />

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
