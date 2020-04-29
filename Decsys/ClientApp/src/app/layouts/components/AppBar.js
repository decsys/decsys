import React from "react";
import { Flex, Link, Grid, Heading } from "@chakra-ui/core";
import { Link as RouterLink } from "@reach/router";

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

const AppBar = ({ brand, children, brandLink }) => (
  <Flex w="100%" justify="center" bg="black">
    <Flex w="1140px" align="center" justify="space-between">
      <Heading size="lg" p={2}>
        <AppBarLink as={RouterLink} to={brandLink}>
          {brand}
        </AppBarLink>
      </Heading>
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

AppBar.defaultProps = {
  brandLink: "/"
};

export default AppBar;
