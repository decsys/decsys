import {
  Button,
  Divider,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field } from "formik";

export const AddCustomWordModel = ({
  isOpen,
  onClose,
  values,
  handleSubmit,
  handleBlur,
  handleChange,
  errors,
  touched,
  setFieldValue,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Custom Word</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit} id="myForm">
            <VStack align="start">
              <FormLabel mb="0">Word</FormLabel>
              <Input
                name="customWord"
                placeholder="New Custom Word"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.customWord}
                isInvalid={touched.customWord && !!errors.customWord}
              />
              {touched.customWord && errors.customWord && (
                <Text color="red">{errors.customWord}</Text>
              )}
              <FormLabel pt="2">Type</FormLabel>
              <Field name="type">
                {({ field }) => (
                  <>
                    <RadioGroup
                      {...field}
                      onChange={(value) => setFieldValue("type", value)}
                    >
                      <Stack direction="row">
                        <Radio value="noun">Noun</Radio>
                        <Radio value="adjective">Adjective</Radio>
                      </Stack>
                    </RadioGroup>
                    {touched.type && errors.type && (
                      <Text color="red">{errors.type}</Text>
                    )}
                  </>
                )}
              </Field>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="myForm"
            isLoading={isSubmitting}
            colorScheme="blue"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
