import object from "yup/lib/object";
import string from "yup/lib/string";
import { ref } from "yup";

const minLength = 6;

export default object().shape({
  Password: string()
    .min(minLength, `Passwords must be at least ${minLength} characters.`)
    .matches(/\d/, "Passwords must have at least one digit ('0' - '9').")
    .matches(/[A-Z]/, "Passwords must have at least one uppercase ('A' - 'Z').")
    .matches(
      /[^A-Za-z0-9]/,
      "Passwords must have at least one non alphanumeric character."
    )
    .required("Please enter a password."),
  PasswordConfirm: string()
    .oneOf([ref("Password")], "Both Password entries must match.")
    .required("Please confirm your password."),
});
