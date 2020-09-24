import { Stack, Flex, Button, useToast, Grid, Text } from "@chakra-ui/core";
import { Formik, Form, Field } from "formik";
import { Page } from "components/core";
import React, { useState } from "react";
import LightHeading from "components/core/LightHeading";
import validationSchema from "./validation";
import ErrorsAlert from "components/core/ErrorsAlert";
import { useAuth } from "auth/AuthContext";
import FormikInput from "components/core/FormikInput";
import { editProfile } from "api/account";

const ProfileForm = ({ profile, setIsEditing }) => {
  const toast = useToast();
  const { login } = useAuth();
  const [errors, setErrors] = useState(null);

  const handleCancel = () => setIsEditing(false);
  const handleSubmit = async (values, actions) => {
    try {
      const { errors } = await editProfile(values);
      setErrors(errors);
      if (!errors?.length) {
        await login(); // silent sign-in to update profile client-side
        toast({
          position: "top",
          title: "Profile updated.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        actions.resetForm();
        setIsEditing(false);
      }
    } catch (e) {
      console.error(e);
      setErrors([e.message]);
    }
    actions.setSubmitting(false);
  };

  return (
    <>
      <ErrorsAlert
        errors={errors}
        title="There was an error with your form submission:"
        shouldCollapseSingles
      />

      <Formik
        initialValues={{
          FullName: profile.fullname,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <Stack spacing={4}>
              <Field name="FullName">
                {(rp) => (
                  <FormikInput
                    {...rp}
                    label="Full Name"
                    placeholder="John Smith"
                    isRequired
                  />
                )}
              </Field>

              <Flex justify="space-between">
                <Button
                  width="3xs"
                  colorScheme="blue"
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  loadingText="Saving"
                >
                  Save Changes
                </Button>
                <Button width="3xs" onClick={handleCancel}>
                  Cancel
                </Button>
              </Flex>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

const ProfileItem = ({ label, value }) => (
  <>
    <Text textAlign="right" fontWeight="bold">
      {label}
    </Text>
    <Text>{value}</Text>
  </>
);

const ProfileDisplay = ({ profile, setIsEditing, isEditing }) => (
  <Grid
    templateColumns="2fr 5fr"
    gap={4}
    alignItems="center"
    width="100%"
    p={2}
  >
    <ProfileItem label="Email Address" value={profile.email} />

    {!isEditing && (
      <>
        <ProfileItem label="Full Name" value={profile.fullname} />

        <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </>
    )}
  </Grid>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  console.log(user.profile);

  return (
    <Page layout="manageAccount">
      <Stack mt={4} w="100%" spacing={4}>
        <LightHeading>Profile</LightHeading>
        <ProfileDisplay
          profile={user.profile}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
        {isEditing && (
          <ProfileForm profile={user.profile} setIsEditing={setIsEditing} />
        )}
      </Stack>
    </Page>
  );
};

export default Profile;
