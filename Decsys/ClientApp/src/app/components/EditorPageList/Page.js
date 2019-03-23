import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import PageHeader from "./PageHeader";
import PageComponent from "./PageComponent";
import PageItem from "./PageItem";

const Page = ({
  components,
  componentList,
  n,
  onRandomToggle,
  onHeadingClick,
  onParagraphClick,
  onImageClick,
  onDuplicateClick,
  onDeleteClick,
  onItemDeleteClick,
  onItemDuplicateClick,
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
      <PageHeader
        n={n}
        onRandomToggle={onRandomToggle}
        onHeadingClick={onHeadingClick}
        onParagraphClick={onParagraphClick}
        onImageClick={onImageClick}
        onDuplicateClick={onDuplicateClick}
        onDeleteClick={onDeleteClick}
      />

      {components.map(x =>
        isResponse(x.type) ? (
          <PageComponent
            components={componentList}
            currentType={x.type}
            onComponentSelect={onComponentSelect}
          />
        ) : (
          <PageItem
            type={x.type}
            text={x.params.text}
            onDeleteClick={onItemDeleteClick}
            onDuplicateClick={onItemDuplicateClick}
          />
        )
      )}
      {components.every(x => !isResponse(x.type)) && (
        <PageComponent
          components={componentList}
          onComponentSelect={onComponentSelect}
        />
      )}
    </FlexBox>
  );
};

Page.propTypes = {
  ...PageHeader.propTypes,
  components: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      params: PropTypes.shape({}).isRequired
    })
  ),
  componentList: PageComponent.propTypes.components,
  onItemDeleteClick: PropTypes.func.isRequired,
  onItemDuplicateClick: PropTypes.func.isRequired,
  onComponentSelect: PropTypes.func.isRequired
};

export default Page;
