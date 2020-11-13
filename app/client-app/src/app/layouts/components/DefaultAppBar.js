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
  FaUserCog,
} from "react-icons/fa";
import { Link, navigate } from "@reach/router";
import { useAuth } from "auth/AuthContext";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";

// TODO: Chakra broke MenuItem as={a}
// so we have to manually do plain anchors in onClick
// REVERT THIS WHEN CHAKRA FIXES IT
const onClickLink = (href, target) => {
  const a = document.createElement("a");
  a.href = href;
  if (target) a.target = target;
  a.click(); // don't even need to add it to the DOM to use this!
};

const HelpMenu = () => (
  <Menu>
    <DarkMode>
      <MenuButton as={IconButton} variant="ghost" icon={<FaQuestionCircle />} />
    </DarkMode>
    <MenuList>
      <MenuItem onClick={() => onClickLink("/docs")}>
        <Stack direction="row" align="center" spacing={1}>
          <Icon as={FaBook} />
          <Text>Documentation</Text>
        </Stack>
      </MenuItem>
      <MenuItem
        onClick={() =>
          onClickLink("http://www.lucidresearch.org/decsys.html", "_blank")
        }
        // as="a"
        // href="http://www.lucidresearch.org/decsys.html"
        // target="_blank"
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
  const { user, login, logout, isSuperUser } = useAuth();

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
          <MenuItem onClick={() => navigate("/user/register")}>
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
            <MenuItem onClick={() => navigate("/user/profile")}>
              <Stack direction="row" align="center" spacing={1}>
                <Icon as={FaUserCog} />
                <Text>Manage Account</Text>
              </Stack>
            </MenuItem>
          )}
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
