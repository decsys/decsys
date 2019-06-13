import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box } from "@smooth-ui/core-sc";
import {
  EllipsisV,
  Heading,
  Paragraph,
  Image,
  Copy,
  Times,
  ArrowsAltV
} from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";

const capitalise = ([first, ...rest]) => first.toUpperCase() + rest.join("");

const PageItem = ({
  id,
  pageId,
  type,
  params,
  onDuplicateClick,
  onDeleteClick,
  onClick,
  provided,
  selected
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Box
      backgroundColor={
        selected ? "cardHighlightBg" : hovered ? "cardHoverBg" : "cardBg"
      }
      width={1}
      py=".2em"
      pr={1}
    >
      <Grid columns="30px 30px 30px 1fr 30px 30px" columnGap=".1em">
        <Cell />

        <Cell middle>
          <div {...provided.dragHandleProps}>
            <Box textAlign="center">
              <EllipsisV size="1em" />
            </Box>
          </div>
        </Cell>
        <Cell
          middle
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onClick}
        >
          <Box textAlign="center">
            {type === "heading" && <Heading size="1em" />}
            {type === "paragraph" && <Paragraph size="1em" />}
            {type === "image" && <Image size="1em" />}
            {type === "spacer" && <ArrowsAltV size="1em" />}
          </Box>
        </Cell>
        <Cell
          middle
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onClick}
        >
          <Typography>
            {params.text || capitalise(type)}
            {type === "spacer" && ` (${params.height}px)`}
          </Typography>
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
          variant="light"
          color="danger"
          onClick={() => onDeleteClick(pageId, id)}
        >
          <Times size="1em" />
        </Button>
      </Grid>
    </Box>
  );
};

PageItem.propTypes = {
  id: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["heading", "paragraph", "image"]).isRequired,
  text: PropTypes.string,
  onDeleteClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PageItem;
