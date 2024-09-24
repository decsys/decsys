import { object, string } from "yup";

export const validationSchema = object({
  type: string().required("You must select a type"),
  customWord: string()
    .required("Custom word is required")
    .matches(/^\S*$/, "Custom word must not contain spaces")
    .when("type", (type, schema) => {
      return type === "noun"
        ? schema.matches(/^[A-Z]/, "Noun must start with a capitalized letter")
        : schema;
    }),
});
