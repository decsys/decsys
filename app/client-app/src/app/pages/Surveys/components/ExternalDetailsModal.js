import { StandardModal } from "components/core";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { capitalise } from "services/strings";
import LightHeading from "components/core/LightHeading";

const Definition = ({ term, definition }) => (
  <>
    <Text fontWeight="bold">{term}</Text>
    <Text>{definition}</Text>
  </>
);

const ExternalDetailsModal = ({
  modalState,
  settings,
  name,
  type,
  hasInvalidExternalLink,
}) => {
  if (!type) return null;
  return (
    <StandardModal
      size="xl"
      {...modalState}
      header={`Survey details`}
      cancelButton={false}
    >
      <Stack w="100%" spacing={2} mb={3}>
        <Stack w="100%" pl={2}>
          <Definition term="Survey Name" definition={name} />
        </Stack>

        <LightHeading size="md">{capitalise(type)} Settings</LightHeading>
        <Stack w="100%" pl={2}>
          {hasInvalidExternalLink && (
            <Alert status="warning">
              <AlertIcon />
              <Stack>
                <AlertTitle>This Survey's external link is broken</AlertTitle>
                <AlertDescription>
                  Another newer DECSYS Survey was created with the same External
                  Survey ID, breaking the link to this Survey.
                </AlertDescription>
              </Stack>
            </Alert>
          )}
          {Object.keys(settings).map((k) => (
            <Definition key={k} term={k} definition={settings[k]} />
          ))}
        </Stack>
      </Stack>
    </StandardModal>
  );
};
export { ExternalDetailsModal };
