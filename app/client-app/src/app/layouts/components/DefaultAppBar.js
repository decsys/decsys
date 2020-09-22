import React, { Suspense } from "react";
import AppBar from "./AppBar";
import {
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  IconButton,
  DarkMode,
  Button,
  Stack,
  MenuGroup,
  Spinner,
} from "@chakra-ui/core";
import {
  FaExternalLinkAlt,
  FaUserCircle,
  FaQuestion,
  FaQuestionCircle,
  FaBook,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "@reach/router";
import { useAuth } from "auth/AuthContext";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";

const HelpMenu = () => (
  <Menu>
    <DarkMode>
      <MenuButton as={IconButton} variant="ghost" icon={<FaQuestionCircle />} />
    </DarkMode>
    <MenuList>
      <MenuItem as="a" href="/docs">
        <Stack direction="row" align="center" spacing={1}>
          <Icon as={FaBook} />
          <Text>Documentation</Text>
        </Stack>
      </MenuItem>
      <MenuItem
        as="a"
        href="http://www.lucidresearch.org/decsys.html"
        target="_blank"
      >
        <Stack direction="row" align="center" spacing={1}>
          <Icon as={FaQuestion} />
          <Text>About DECSYS</Text>
          <sup>
            <Icon as={FaExternalLinkAlt} />
          </sup>
        </Stack>
      </MenuItem>
    </MenuList>
  </Menu>
);

const UserMenu = () => {
  const { allowRegistration } = useServerConfig();
  const { user, login, logout } = useAuth();

  let menuItems = null;
  if (!user) {
    menuItems = (
      <>
        <MenuItem onClick={login}>
          <Stack direction="row" align="center" spacing={1}>
            <Icon as={FaSignInAlt} />
            <Text>Login</Text>
          </Stack>
        </MenuItem>
        {allowRegistration && (
          <MenuItem as={Link} to="/user/register">
            <Stack direction="row" align="center" spacing={1}>
              <Icon as={FaUserPlus} />
              <Text>Register</Text>
            </Stack>
          </MenuItem>
        )}
      </>
    );
  } else {
    menuItems = (
      <>
        <MenuGroup title={user.profile.name}>
          <MenuItem onClick={logout}>
            <Stack direction="row" align="center" spacing={1}>
              <Icon as={FaSignOutAlt} />
              <Text>Logout</Text>
            </Stack>
          </MenuItem>
        </MenuGroup>
      </>
    );
  }

  return (
    <Menu>
      <DarkMode>
        <MenuButton
          as={IconButton}
          variant="ghost"
          colorScheme={!user ? "red" : "green"}
          icon={<FaUserCircle />}
        />
      </DarkMode>
      <MenuList>{menuItems}</MenuList>
    </Menu>
  );
};

const DefaultAppBar = ({ brandLink }) => {
  const { mode } = useServerConfig();
  const { isAdmin } = useAuth();
  return (
    <AppBar brand="DECSYS" brandLink={brandLink}>
      {isAdmin && (
        <DarkMode>
          <Button as={Link} variant="ghost" to="/admin">
            Admin
          </Button>
        </DarkMode>
      )}

      {mode !== WORKSHOP && (
        <Suspense fallback={<Spinner />}>
          <UserMenu />
        </Suspense>
      )}

      <HelpMenu />
    </AppBar>
  );
};

export default DefaultAppBar;
