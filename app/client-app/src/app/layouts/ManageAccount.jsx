import { Grid, Stack, Button, Flex, Divider } from "@chakra-ui/react";
import Default from "./Default";
import LightHeading from "components/core/LightHeading";
import { Link, useLocation } from "@reach/router";

const NavButton = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Button as={Link} to={to} colorScheme={isActive ? "blue" : null}>
      {children}
    </Button>
  );
};

const Sidebar = () => (
  <Stack p={4}>
    <LightHeading textAlign="center" as="h4" size="sm">
      Manage Account
    </LightHeading>
    <Divider />

    <NavButton to="/user/profile">Edit Profile</NavButton>
    <NavButton to="/user/email">Change Email Address</NavButton>
    <NavButton to="/user/password">Change Password</NavButton>
  </Stack>
);

const ManageAccount = ({ children }) => {
  return (
    <Default>
      <Grid templateColumns="250px 1fr">
        <Sidebar />
        <Flex w="100%" p={4}>
          {children}
        </Flex>
      </Grid>
    </Default>
  );
};

export default ManageAccount;
