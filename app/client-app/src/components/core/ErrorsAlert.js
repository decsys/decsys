import { Alert, AlertIcon, Stack, Flex, Grid } from "@chakra-ui/react";

const ErrorsAlert = ({ title, errors, shouldCollapseSingles, ...p }) => {
  if (!errors || !errors.length) return null;

  const shouldCollapse = !title;
  shouldCollapseSingles = shouldCollapseSingles || shouldCollapse;
  // always make it an array to simplify things,
  // even if we someomtimes only use the first element...
  if (!Array.isArray(errors)) errors = [errors];

  let collapsedRender = title;
  let listRender = null;
  if (errors.length === 1 && shouldCollapseSingles) {
    collapsedRender = errors[0];
  } else {
    listRender = (
      <ul>
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    );
  }

  return (
    <Alert status="error" {...p}>
      <Grid templateColumns="32px auto">
        <Flex>
          <AlertIcon boxSize="24px" />
        </Flex>
        <Stack spacing={0}>
          <Flex>{collapsedRender}</Flex>
          <Flex px={shouldCollapse ? 4 : 8}>{listRender}</Flex>
        </Stack>
      </Grid>
    </Alert>
  );
};

export default ErrorsAlert;
