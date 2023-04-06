import ResponseItem from "./ResponseItem";
import Icon from "./Icon";
import { useState } from "react";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setIsValidResponse: () => {},
};

export default {
  title: "Number",
  component: ResponseItem,
};

export const Basic = {
  render: (args) => {
    const handleLabelChange = () => {
      _context.setIsValidResponse(true); // toggle the Next Button
    };
    return (
      <ResponseItem
        {...args}
        _context={_context}
        onLabelChange={handleLabelChange}
      />
    );
  },
  args: {
    min: ResponseItem.params.min.defaultValue,
    max: ResponseItem.params.max.defaultValue,
    defaultValue: ResponseItem.params.defaultValue.defaultValue,
    precision: ResponseItem.params.precision.defaultValue,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
