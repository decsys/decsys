import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Button, Box } from "@smooth-ui/core-sc";
import ReactTooltip from "react-tooltip";
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

  const randomButton = useRef();
  useEffect(() => {
    ReactTooltip.hide(randomButton.current);
    ReactTooltip.rebuild();
    ReactTooltip.show(randomButton.current);
  }, [page.randomize]);

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
            data-tip={`${page.randomize}`}
            data-for="random"
            ref={randomButton}
          >
            <Random size="1em" />
            <ReactTooltip
              id="random"
              effect="solid"
              getContent={tip => (
                <>
                  Random is{" "}
                  <Typography
                    fontWeight="bold"
                    color={tip === "true" ? "success" : "danger"}
                  >
                    {tip === "true" ? "ON" : "OFF"}
                  </Typography>{" "}
                  for this Page.
                  <Typography as="div" color="warning">
                    <ExclamationTriangle size="1em" /> Random Pages are only
                    randomised *between* Fixed Pages.
                  </Typography>
                </>
              )}
            ></ReactTooltip>
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
            data-tip
            data-for="heading"
          >
            <Heading size="1em" />
            <ReactTooltip id="heading" effect="solid">
              Add a Heading to this Page
            </ReactTooltip>
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
            data-tip
            data-for="paragraph"
          >
            <Paragraph size="1em" />
            <ReactTooltip id="paragraph" effect="solid">
              Add a Paragraph to this Page
            </ReactTooltip>
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
            data-tip
            data-for="image"
          >
            <Image size="1em" />
            <ReactTooltip id="image" effect="solid">
              Add an Image to this Page
            </ReactTooltip>
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
            data-tip
            data-for="spacer"
          >
            <ArrowsAltV size="1em" />
            <ReactTooltip id="spacer" effect="solid">
              Add a Vertical Spacer to this Page
            </ReactTooltip>
          </Button>
        </Cell>

        <Cell middle>
          <Button
            size="sm"
            variant="light"
            backgroundColor="lightest"
            color="info"
            onClick={() => onDuplicateClick(page.id)}
            data-tip
            data-for="duplicate"
          >
            <Copy size="1em" />
            <ReactTooltip id="duplicate" effect="solid">
              Duplicate this Page
            </ReactTooltip>
          </Button>
        </Cell>
        <Cell middle>
          <Button
            size="sm"
            variant="light"
            color="danger"
            backgroundColor="lightest"
            onClick={() => onDeleteClick(page.id)}
            data-tip
            data-for="delete"
          >
            <Trash size="1em" />
            <ReactTooltip id="delete" effect="solid">
              Delete this Page
            </ReactTooltip>
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
