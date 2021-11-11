import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider } from "@chakra-ui/react";

addDecorator((s) => <ChakraProvider>{s()}</ChakraProvider>);

addDecorator(withKnobs());
