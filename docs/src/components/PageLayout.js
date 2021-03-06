import React from "react"; // eslint-disable-line no-unused-vars
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useThemeContext from "@theme/hooks/useThemeContext";
import { ChakraProvider, extendTheme, useColorMode } from "@chakra-ui/react";

extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

const ColorModeSync = () => {
  const { isDarkTheme } = useThemeContext();
  const { colorMode, toggleColorMode } = useColorMode();
  switch (colorMode) {
    case "dark":
      if (!isDarkTheme) toggleColorMode();
      break;
    default:
      if (isDarkTheme) toggleColorMode();
  }

  return null;
};

const PageLayout = ({ title, description, children }) => {
  const { siteConfig = {} } = useDocusaurusContext();

  return (
    <ChakraProvider resetCSS>
      <Layout
        title={`${siteConfig.title} - ${title}`}
        description={description}
      >
        <ColorModeSync />
        {children}
      </Layout>
    </ChakraProvider>
  );
};

export default PageLayout;
