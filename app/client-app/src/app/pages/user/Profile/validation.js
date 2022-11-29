import object from "yup/lib/object";
import string from "yup/lib/string";

export default object().shape({
  FullName: string().required("Please enter your name."),
});
