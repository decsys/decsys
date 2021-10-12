import React from "react"; // eslint-disable-line no-unused-vars
import OriginalLayout from "@theme-original/Layout";
import useThemeContext from "@theme/hooks/useThemeContext";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from "@chakra-ui/react";

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

const Layout = ({ title, description, children }) => {
  const { siteConfig = {} } = useDocusaurusContext();

  return (
    <OriginalLayout
      title={`${siteConfig.title} - ${title}`}
      description={description}
    >
      <ColorModeSync />
      {children}
    </OriginalLayout>
  );
};

export default Layout;
