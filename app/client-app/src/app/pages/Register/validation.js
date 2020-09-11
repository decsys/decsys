import object from "yup/lib/object";
import string from "yup/lib/string";
import { ref } from "yup";

export default object().shape({
  Fullname: string().required("Please enter your name."),
  Email: string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
  EmailConfirm: string()
    .oneOf([ref("Email")], "Both Email Address entries must match.")
    .required("Please confirm your email address."),
  Password: string().required("Please enter a password."),
  PasswordConfirm: string()
    .oneOf([ref("Password")], "Both Password entries must match.")
    .required("Please confirm your password."),
});
