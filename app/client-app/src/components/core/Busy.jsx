import { Container } from "@chakra-ui/react";
import LoadingIndicator from "./LoadingIndicator";

/**
 * Includes a `Container` so more suitable for Pages
 * @param {object} props
 * @param {string} [props.verb] Verb for loading indication
 * @param {string?} [props.noun] Noun for loading indication
 * @param {object?} [props.containerProps] Props to pass to the container
 * @returns
 */
const BusyPage = ({ verb = "Loading", noun, containerProps = {} }) => {
  return (
    <Container {...containerProps}>
      <LoadingIndicator verb={verb} noun={noun} />
    </Container>
  );
};

export default BusyPage;
