import React, { createElement } from "react";
import {
  Grid,
  Flex,
  Button,
  Input,
  IconButton,
  useColorMode,
  DarkMode,
  LightMode,
  ColorModeProvider
} from "@chakra-ui/core";
import PageList from "./components/PageList";
import {
  FaEye,
  FaFileExport,
  FaCopy,
  FaTrash,
  FaMoon,
  FaSun,
  FaChevronLeft
} from "react-icons/fa";
import { Link } from "@reach/router";
import EditorBar from "./components/EditorBar";

const Editor = ({ id }) => (
  <Grid
    templateColumns="1fr 2fr"
    templateRows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
    gap={0}
    height="100%"
    style={{ height: "100vh" }}
  >
    <Flex boxShadow="0 2px 2px rgba(0,0,0,0.6)" gridColumn="span 2">
      <EditorBar />
    </Flex>

    <Flex boxShadow="2px 5px 5px rgba(0,0,0,0.6)" gridRow="span 2">
      <PageList />
    </Flex>

    <Flex>Page Editor</Flex>
    <Flex>Params Editor</Flex>
  </Grid>
);

export default Editor;
