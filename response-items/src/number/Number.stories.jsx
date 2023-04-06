import ParamTypes from "@decsys/param-types";
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
    const [label, setLabel] = useState(15);

    const handleLabelChange = (value) => {
      setLabel(value);
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
    min: 10,
    max: 20,
    defaultValue: 15,
    precision: 2,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
