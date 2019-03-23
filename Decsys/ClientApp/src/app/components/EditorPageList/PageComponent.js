import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { Typography, Box, Select } from "@smooth-ui/core-sc";
import { Question, EllipsisV } from "styled-icons/fa-solid";
import { Grid, Cell } from "styled-css-grid";

const PageComponent = ({
  components,
  currentType,
  onComponentSelect,
  provided
}) => {
  const component = components.find(x => x.type === currentType);
  const Icon = component ? (
    cloneElement(component.icon, { size: "1em" })
  ) : (
    <Question size="1em" />
  );
  return (
    <Box backgroundColor="cardBg" width={1} pr={1} py=".2em">
      <Grid columns="30px 30px 30px auto 1fr" columnGap=".1em">
        <Cell />
        <Cell middle>
          {currentType && (
            <div {...provided.dragHandleProps}>
              <Box textAlign="center">
                <EllipsisV size="1em" />
              </Box>
            </div>
          )}
        </Cell>
        <Cell middle>
          <Box textAlign="center">{Icon}</Box>
        </Cell>
        <Cell
          middle
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}
        >
          <Typography mr={1}>Component</Typography>
        </Cell>
        <Cell>
          <Select
            size="sm"
            control
            onChange={e => onComponentSelect(e.target.value)}
            value={currentType}
          >
            <option value="">None</option>
            {components.map(x => (
              <option key={x.type} value={x.type}>
                {x.type}
              </option>
            ))}
          </Select>
        </Cell>
      </Grid>
    </Box>
  );
};

PageComponent.propTypes = {
  components: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ),
  currentType: PropTypes.string,
  onComponentSelect: PropTypes.func.isRequired
};

export default PageComponent;
