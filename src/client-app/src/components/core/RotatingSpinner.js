import styled from "styled-components";
import { rotate } from "animations/rotate";
import { Spinner } from "styled-icons/fa-solid";

const RotatingSpinner = styled(Spinner)`
  animation: ${rotate} 2s linear infinite;
`;

export default RotatingSpinner;
