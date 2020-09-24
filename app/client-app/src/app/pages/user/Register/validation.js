import object from "yup/lib/object";
import string from "yup/lib/string";
import { ref } from "yup";

const minLength = 6;

export default object().shape({
  Fullname: string().required("Please enter your name."),
  Email: string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  EmailConfirm: string()
    .oneOf([ref("Email")], "Both Email Address entries must match.")
    .required("Please confirm your email address."),
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
