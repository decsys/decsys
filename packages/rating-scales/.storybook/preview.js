/** @type { import('@storybook/react').Preview } */
import { ChakraProvider } from "@chakra-ui/react";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider resetCSS>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
