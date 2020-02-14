import styled from "styled-components";
import { rotate } from "../../utils/keyframes";
import { Spinner } from "styled-icons/fa-solid";

const RotatingSpinner = styled(Spinner)`
  animation: ${rotate} 2s linear infinite;
`;

export default RotatingSpinner;
