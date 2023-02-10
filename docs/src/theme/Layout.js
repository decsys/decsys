import React, { useEffect } from "react"; // eslint-disable-line no-unused-vars
import OriginalLayout from "@theme-original/Layout";
import { useColorMode as useThemeColorMode } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from "@chakra-ui/react";

const ColorModeSync = () => {
  const isDarkTheme = useThemeColorMode().colorMode === "dark";
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    switch (colorMode) {
      case "dark":
        if (!isDarkTheme) toggleColorMode();
        break;
      default:
        if (isDarkTheme) toggleColorMode();
    }
  }, [isDarkTheme, colorMode, toggleColorMode]);

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
