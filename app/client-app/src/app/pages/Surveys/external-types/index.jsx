import {
  prolificInitialValues,
  ProlificSettings,
  prolificValidationSchema,
} from "./prolific";

export const EditableSettings = ({ type, ...formProps }) => {
  switch (type) {
    case "prolific":
      return <ProlificSettings />;
    default:
      return null;
  }
};

export const getValidationSchema = (type) => {
  switch (type) {
    case "prolific":
      return prolificValidationSchema;
    default:
      return null;
  }
};

export const getInitialValues = (type) => {
  switch (type) {
    case "prolific":
      return prolificInitialValues;
    default:
      return null;
  }
};
