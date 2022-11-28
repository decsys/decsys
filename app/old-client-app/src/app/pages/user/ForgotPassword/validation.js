import object from "yup/lib/object";
import string from "yup/lib/string";

export default object().shape({
  Email: string()
    .email("Please enter a valid email address.")
    .required("Please enter your email address."),
});
