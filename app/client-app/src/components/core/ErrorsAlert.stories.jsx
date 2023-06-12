import { Text } from "@chakra-ui/react";
import ErrorsAlert from "./ErrorsAlert";

const errors = [
  "Something went wrong",
  "There was an issue",
  "Failed to replicate splines",
];

export default {
  title: "Core UI/ErrorsAlert",
  component: ErrorsAlert,
};

export const SingleStringError = () => <ErrorsAlert errors={errors[0]} />;
export const SingleArrayError = () => <ErrorsAlert errors={[errors[0]]} />;
export const SingleWithTitle = () => (
  <ErrorsAlert errors={errors[0]} title="Something wonderful has happened:" />
);
export const CollapseSingleError = () => (
  <ErrorsAlert
    errors={errors[0]}
    title="Not gonna see me"
    shouldCollapseSingles
  />
);

export const MultipleErrorsNoTitle = () => <ErrorsAlert errors={errors} />;
export const MultipleErrorsWithTitle = () => (
  <ErrorsAlert errors={errors} title="Check it out:" />
);
export const DontCollapseMultipleErrors = () => (
  <ErrorsAlert errors={errors} title="Hello" shouldCollapseSingles />
);

export const TitleNode = () => (
  <ErrorsAlert title={<Text color="red.500">My Title</Text>} errors={errors} />
);
