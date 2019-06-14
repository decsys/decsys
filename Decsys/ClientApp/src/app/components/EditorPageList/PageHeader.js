import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box } from "@smooth-ui/core-sc";
import {
  EllipsisV,
  Heading,
  Copy,
  Trash,
  Paragraph,
  Image,
  Random,
  ArrowsAltV
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
            title={`Random is ${
              page.randomize ? "ON" : "OFF"
            } for this Page. Careful: Random Pages are only randomised *between* Fixed Pages.`}
            checked={page.randomize}
          >
            <Random size="1em" />
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
            title="Add a Heading to this Page"
          >
            <Heading size="1em" />
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
            title="Add a Paragraph to this Page"
          >
            <Paragraph size="1em" />
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
            title="Add an Image to this Page"
          >
            <Image size="1em" />
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
            title="Add a Vertical Spacer to this Page"
          >
            <ArrowsAltV size="1em" />
          </Button>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="light"
            backgroundColor="lightest"
            color="info"
            onClick={() => onDuplicateClick(page.id)}
            title="Duplicate this Page"
          >
            <Copy size="1em" />
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
