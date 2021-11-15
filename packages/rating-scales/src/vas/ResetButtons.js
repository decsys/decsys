import { Button, Stack } from "@chakra-ui/react";

export const ResetButtons = ({ resetLast, resetAll }) => {
  if (!resetLast && !resetAll) return null;

  return (
    <Stack direction="row" justify="center" mt={5}>
      {resetLast.onClick && (
        <Button
          size="sm"
          disabled={resetLast.isDisabled}
          onClick={resetLast.onClick}
        >
          Reset last
        </Button>
      )}
      {resetAll.onClick && (
        <Button
          size="sm"
          disabled={resetAll.isDisabled}
          onClick={resetAll.onClick}
        >
          Reset all
        </Button>
      )}
    </Stack>
  );
};
