import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box } from "@smooth-ui/core-sc";
import {
  EllipsisV,
  Heading,
  Paragraph,
  Image,
  Copy,
  Times
} from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";

const capitalise = ([first, ...rest]) => first.toUpperCase() + rest.join("");

const PageItem = ({
  id,
  pageId,
  type,
  text,
  onDuplicateClick,
  onDeleteClick
}) => (
  <Box backgroundColor="cardBg" width={1} py=".2em" pr={1}>
    <Grid columns="30px 30px 30px 1fr 30px 30px" columnGap=".1em">
      <Cell />

      <Cell middle>
        <Box textAlign="center">
          <EllipsisV size="1em" />
        </Box>
      </Cell>
      {
        //TODO: drag handle
      }
      <Cell middle>
        <Box textAlign="center">
          {type === "heading" && <Heading size="1em" />}
          {type === "paragraph" && <Paragraph size="1em" />}
          {type === "image" && <Image size="1em" />}
        </Box>
      </Cell>
      <Cell
        middle
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap"
        }}
      >
        <Typography>{text || capitalise(type)}</Typography>
      </Cell>
      <Button
        size="sm"
        variant="light"
        onClick={() => onDuplicateClick(pageId, id)}
      >
        <Copy size="1em" />
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => onDeleteClick(pageId, id)}
      >
        <Times size="1em" />
      </Button>
    </Grid>
  </Box>
);

PageItem.propTypes = {
  id: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["heading", "paragraph", "image"]).isRequired,
  text: PropTypes.string,
  onDeleteClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired
};

export default PageItem;
