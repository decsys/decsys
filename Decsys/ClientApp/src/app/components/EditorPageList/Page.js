import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import PageHeader from "./PageHeader";
import PageComponent from "./PageComponent";
import PageItem from "./PageItem";

const Page = ({
  page,
  componentList,
  n,
  itemActions,
  pageActions,
  onComponentSelect
}) => {
  const isResponse = type => !["heading", "paragraph", "image"].includes(type);
  return (
    <FlexBox
      flexDirection="column"
      border={1}
      borderColor="cardBorder"
      backgroundColor="cardBg"
    >
      <PageHeader n={n} actions={pageActions} />

      {page.components
        .sort(({ order: a }, { order: b }) => a - b)
        .map((x, i) =>
          isResponse(x.type) ? (
            <PageComponent
              key={i}
              components={componentList}
              currentType={x.type}
              onComponentSelect={onComponentSelect}
            />
          ) : (
            <PageItem
              key={i}
              type={x.type}
              text={x.params.text}
              {...itemActions}
            />
          )
        )}
      {page.components.every(x => !isResponse(x.type)) && (
        <PageComponent
          components={componentList}
          onComponentSelect={onComponentSelect}
        />
      )}
    </FlexBox>
  );
};

Page.propTypes = {
  n: PageHeader.propTypes.n,
  pageActions: PageHeader.propTypes.actions,
  itemActions: PropTypes.shape({
    onDeleteClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired
  }),
  onComponentSelect: PropTypes.func.isRequired,
  page: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    components: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        params: PropTypes.shape({}).isRequired
      })
    )
  }),
  componentList: PageComponent.propTypes.components
};

export default Page;
