import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { ChakraProvider, CSSReset, LightMode } from "@chakra-ui/core";
import chakraTheme from "@chakra-ui/theme";

const theme = {
  ...chakraTheme,
  config: {
    initialColorMode: "light",
  },
};

const PageLayout = ({ title, description, children }) => {
  const { siteConfig = {} } = useDocusaurusContext();

  return (
    <Layout title={`${siteConfig.title} - ${title}`} description={description}>
      {children}
    </Layout>
  );
};

export default PageLayout;
