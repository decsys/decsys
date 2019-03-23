import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box, Switch } from "@smooth-ui/core-sc";
import {
  EllipsisV,
  Heading,
  Copy,
  Trash,
  Paragraph,
  Image
} from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";

const PageHeader = ({
  n,
  id,
  actions: {
    onRandomToggle,
    onAddPageItemClick,
    onDuplicateClick,
    onDeleteClick
  }
}) => {
  return (
    <Box pr={1} border="red" borderBottom={1}>
      <Grid columns="30px 1fr 70px 30px 30px 30px 30px 30px" columnGap=".1em">
        <Cell middle>
          <Box textAlign="center">
            <EllipsisV size="1em" />
          </Box>
        </Cell>
        {
          //TODO: drag handle
        }
        <Cell middle>
          <Typography>Page {n}</Typography>
        </Cell>

        <Cell middle>
          <Box textAlign="center">
            Random
            <Switch size="sm" onClick={onRandomToggle} />
          </Box>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="success"
            onClick={() => onAddPageItemClick(id, "heading")}
            title="Add a Heading to this Page"
          >
            <Heading size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="success"
            onClick={() => onAddPageItemClick(id, "paragraph")}
            title="Add a Paragraph to this Page"
          >
            <Paragraph size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="success"
            onClick={() => onAddPageItemClick(id, "image")}
            title="Add an Image to this Page"
          >
            <Image size="1em" />
          </Button>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="light"
            onClick={onDuplicateClick}
            title="Duplicate this Page"
          >
            <Copy size="1em" />
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDeleteClick(id)}
            title="Delete this Page"
          >
            <Trash size="1em" />
          </Button>
        </Cell>
      </Grid>
    </Box>
  );
};

PageHeader.propTypes = {
  id: PropTypes.string.isRequired,
  n: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onRandomToggle: PropTypes.func.isRequired,
    onAddPageItemClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  }).isRequired
};

export default PageHeader;
