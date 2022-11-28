import { Flex, Icon } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { spin } from "animations/spin";
import { FaSpinner } from "react-icons/fa";

const Spinner = () => (
  <Flex
    align="center"
    css={css`
      animation: ${spin} 1s infinite linear;
    `}
  >
    <Icon as={FaSpinner} />
  </Flex>
);

export default Spinner;
