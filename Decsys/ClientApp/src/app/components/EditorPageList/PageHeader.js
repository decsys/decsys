import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box, Switch } from "@smooth-ui/core-sc";
import { FlexBox } from "../ui";
import {
  EllipsisV,
  Heading,
  Copy,
  Trash,
  Paragraph,
  Image
} from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";

// TODO: Wire buttons

const PageHeader = ({ n }) => {
  return (
    <Box pr={1}>
      <Grid columns="30px 1fr 60px 30px 30px 30px 30px 30px">
        <Cell middle>
          <Box textAlign="center">
            <EllipsisV size="1em" />
          </Box>
        </Cell>
        {
          //TODO: drag handle
        }
        <Cell middle>
          <Typography p={1}>Page {n}</Typography>
        </Cell>

        <Cell middle>
          <Box textAlign="center">
            Random
            <Switch size="sm" />
          </Box>
        </Cell>

        <Cell middle>
          <Button size="sm" variant="success">
            <Heading size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button size="sm" variant="success">
            <Paragraph size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button size="sm" variant="success">
            <Image size="1em" />
          </Button>
        </Cell>

        <Cell middle>
          <Button size="sm" variant="light">
            <Copy size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button size="sm" variant="danger">
            <Trash size="1em" />
          </Button>
        </Cell>
      </Grid>
    </Box>
  );
};

PageHeader.propTypes = {
  n: PropTypes.number.isRequired
};

export default PageHeader;
