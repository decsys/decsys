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
} from "@chakra-ui/react";
import {
  FaExternalLinkAlt,
  FaUserCircle,
  FaQuestion,
  FaQuestionCircle,
  FaBook,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCog,
} from "react-icons/fa";
import { Link, useLocation } from "@reach/router";
import { useAuth } from "auth/AuthContext";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";
import { LoadingIndicator } from "components/core";

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
  const location = useLocation();
  const { user, login, logout, isSuperUser } = useAuth();

  const handleLoginClick = () => {
    login({ returnUrl: location.pathname === "/survey" ? "/" : undefined });
  };

  let menuItems = null;
  if (!user) {
    menuItems = (
      <>
        <MenuItem closeOnSelect onClick={handleLoginClick}>
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
          {!isSuperUser && (
            <MenuItem as={Link} to="/user/profile">
              <Stack direction="row" align="center" spacing={1}>
                <Icon as={FaUserCog} />
                <Text>Manage Account</Text>
              </Stack>
            </MenuItem>
          )}
          <MenuItem closeOnSelect onClick={logout}>
            <Stack direction="row" align="center" spacing={1}>
              <Icon as={FaSignOutAlt} />
              <Text>Logout</Text>
            </Stack>
          </MenuItem>
        </MenuGroup>
      </>
    );
  }

  return user === undefined ? (
    <LoadingIndicator
      textProps={{ color: "white" }}
      verb="Checking"
      noun="user"
    />
  ) : (
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
          <Button as={Link} variant="ghost" to="/survey">
            Take a Survey
          </Button>
        </DarkMode>
      )}
      {isAdmin && (
        <DarkMode>
          <Button as={Link} variant="ghost" to="/admin">
            Admin
          </Button>
        </DarkMode>
      )}

      {mode !== WORKSHOP && <UserMenu />}

      <HelpMenu />
    </AppBar>
  );
};

export default DefaultAppBar;
