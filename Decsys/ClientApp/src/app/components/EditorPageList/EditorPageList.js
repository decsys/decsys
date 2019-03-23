import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import { Typography, Box, Button } from "@smooth-ui/core-sc";
import Page from "./Page";
import { Plus } from "styled-icons/fa-solid";

const EditorPageList = ({ actions, components, pages }) => (
  <FlexBox flexDirection="column" px={2}>
    <FlexBox justifyContent="space-between" alignItems="center">
      <Typography textAlign="center" p={1}>
        Survey Pages
      </Typography>
      <Button size="sm" variant="success" onClick={actions.onAddClick}>
        <Plus size="1em" /> Add Page
      </Button>
    </FlexBox>
    {pages
      .sort(({ order: a }, { order: b }) => a - b)
      .map((x, i) => {
        return (
          <Box key={i} mb={1}>
            <Page
              n={x.order}
              page={x}
              componentList={components}
              {...actions}
            />
          </Box>
        );
      })}
  </FlexBox>
);

EditorPageList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape(Page.propTypes.page)),
  components: Page.propTypes.componentList,
  actions: PropTypes.shape({
    onAddClick: PropTypes.func.isRequired,
    onComponentSelect: PropTypes.func.isRequired,
    pageActions: Page.propTypes.pageActions,
    itemActions: Page.propTypes.itemActions
  })
};

export default EditorPageList;
