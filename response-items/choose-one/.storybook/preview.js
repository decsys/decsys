import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({ zIndices: { portal: 999 } });

addDecorator((s) => (
  <ChakraProvider resetCSS theme={theme}>
    {s()}
  </ChakraProvider>
));

addDecorator(withKnobs());
