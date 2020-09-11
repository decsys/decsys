import object from "yup/lib/object";
import string from "yup/lib/string";

export default object().shape({
  Username: string()
    .email("Please enter a valid email address.")
    .required("Please enter your account email address."),
  Password: string().required("Please enter your account password."),
});
