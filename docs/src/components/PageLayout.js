import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useThemeContext from "@theme/hooks/useThemeContext";
import { ChakraProvider, useColorMode, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import merge from "lodash-es/merge";

merge(theme, {
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
    <ChakraProvider theme={theme}>
      <CSSReset />
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
