import { navigate } from "@reach/router";
import { useQueryStringViewModel } from "hooks/useQueryString";
import PasswordFieldGroup from "../components/PasswordFieldGroup";
import { postObjectAsFormData } from "js-forms";
import { Flex, Stack, Button } from "@chakra-ui/react";
import { BusyPage, Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import { Formik, Form } from "formik";
import validationSchema from "./validation";

const ResetPassword = () => {
  const { userId, code } = useQueryStringViewModel();

  if (!userId || !code) {
    navigate("/user/feedback/linkerror");
    return <BusyPage />;
  }

  const handleCancel = () => navigate(-1);
  const handleSubmit = (values, actions) => {
    postObjectAsFormData(`/account/password/${userId}/${code}`, values);
    actions.setSubmitting(false);
  };

  return (
    <Page>
      <Flex w="100%" justify="center">
        <Stack mt={4} w="70%" spacing={4}>
          <LightHeading>Reset Password</LightHeading>

          <Formik
            initialValues={{ Password: "", PasswordConfirm: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={4}>
                  <PasswordFieldGroup />

                  <Flex justify="space-between">
                    <Button
                      width="3xs"
                      colorScheme="blue"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Reset Password
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

export default ResetPassword;
