import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box, Tooltip } from "@smooth-ui/core-sc";
import {
  EllipsisV,
  Heading,
  Copy,
  Trash,
  Paragraph,
  Image,
  Random,
  ArrowsAltV,
  ExclamationTriangle
} from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";
import ToggleButton from "../ui/ToggleButton";

const PageHeader = ({
  n,
  page,
  provided,
  actions: {
    onRandomToggle,
    onAddPageItemClick,
    onDuplicateClick,
    onDeleteClick
  }
}) => {
  const handleRandomToggle = e => onRandomToggle(page.id, e.target.checked);

  return (
    <Box pr={1} borderBottom={1} borderColor="cardBorder">
      <Grid
        columns="30px 1fr 40px 30px 30px 30px 30px 30px 30px"
        columnGap=".1em"
      >
        <Cell middle>
          <div {...provided.dragHandleProps}>
            <Box textAlign="center">
              <EllipsisV size="1em" />
            </Box>
          </div>
        </Cell>

        <Cell middle>
          <Typography>Page {n}</Typography>
        </Cell>

        <Cell>
          <ToggleButton
            size="sm"
            variant="info"
            onClick={handleRandomToggle}
            checked={page.randomize}
          >
            <Random size="1em" />
            <Tooltip placement="bottom">
              Random is{" "}
              <Typography
                fontWeight="bold"
                color={page.randomize ? "success" : "danger"}
              >
                {page.randomize ? "ON" : "OFF"}
              </Typography>{" "}
              for this Page.
              <Typography as="div" color="warning">
                <ExclamationTriangle size="1em" /> Random Pages are only
                randomised *between* Fixed Pages.
              </Typography>
            </Tooltip>
          </ToggleButton>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="success"
            border={1}
            borderColor="success"
            backgroundColor="lightest"
            onClick={() => onAddPageItemClick(page.id, "heading")}
          >
            <Heading size="1em" />
            <Tooltip placement="bottom">Add a Heading to this Page</Tooltip>
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="success"
            border={1}
            borderColor="success"
            backgroundColor="lightest"
            onClick={() => onAddPageItemClick(page.id, "paragraph")}
          >
            <Paragraph size="1em" />
            <Tooltip placement="bottom">Add a Paragraph to this Page</Tooltip>
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="success"
            border={1}
            borderColor="success"
            backgroundColor="lightest"
            onClick={() => onAddPageItemClick(page.id, "image")}
          >
            <Image size="1em" />
            <Tooltip placement="bottom">Add an Image to this Page</Tooltip>
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="success"
            border={1}
            borderColor="success"
            backgroundColor="lightest"
            onClick={() => onAddPageItemClick(page.id, "spacer")}
          >
            <ArrowsAltV size="1em" />
            <Tooltip placement="bottom">
              Add a Vertical Spacer to this Page
            </Tooltip>
          </Button>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="light"
            backgroundColor="lightest"
            color="info"
            onClick={() => onDuplicateClick(page.id)}
          >
            <Copy size="1em" />
            <Tooltip placement="bottom">Duplicate this Page</Tooltip>
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="danger"
            backgroundColor="lightest"
            onClick={() => onDeleteClick(page.id)}
            title="Delete this Page"
          >
            <Trash size="1em" />
            <Tooltip placement="bottom">Delete this Page</Tooltip>
          </Button>
        </Cell>
      </Grid>
    </Box>
  );
};

PageHeader.propTypes = {
  page: PropTypes.shape({}).isRequired,
  n: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onRandomToggle: PropTypes.func.isRequired,
    onAddPageItemClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  }).isRequired
};

export default PageHeader;
