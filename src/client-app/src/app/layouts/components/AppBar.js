import React from "react";
import { Flex, Link, Grid, useColorMode } from "@chakra-ui/core";
import { Link as RouterLink } from "@reach/router";
import LightHeading from "components/core/LightHeading";

export const AppBarLink = p => (
  <Link
    color="gray.400"
    _focus={{}}
    _hover={{
      color: "gray.300",
      textShadow: "black 1px 1px 2px, grey 0 0 .2em, white 0 0 .5em"
    }}
    {...p}
  />
);

const AppBar = ({ brand, children, brandLink }) => {
  const { colorMode } = useColorMode();
  const bg = { light: "gray.800", dark: "gray.700" };
  return (
    <Flex w="100%" justify="center" bg={bg[colorMode]} boxShadow="section-h">
      <Flex
        w={{ base: "100%", lg: "1140px" }}
        px={{ base: 2, xl: 0 }}
        align="center"
        justify="space-between"
      >
        <LightHeading size="lg" p={2}>
          <AppBarLink as={RouterLink} to={brandLink}>
            {brand}
          </AppBarLink>
        </LightHeading>
        {children != null && (
          <Grid
            alignItems="center"
            gap="1em"
            templateColumns={Array(children.length || 1)
              .fill("auto")
              .join(" ")}
          >
            {children}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
};

AppBar.defaultProps = {
  brandLink: "/"
};

export default AppBar;
