import { useState } from "react";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

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

export const Basic = () => {
  const [label, setLabel] = useState(ResponseItem.params.label.defaultValue);

  const handleLabelChange = (value) => {
    setLabel(value);
    _context.setIsValidResponse(true); // toggle the Next Button
  };

  return (
    <ResponseItem
      label={label}
      min={ResponseItem.params.label.min}
      max={ResponseItem.params.label.max}
      precision={ResponseItem.params.label.precision}
      onLabelChange={handleLabelChange}
      _context={_context}
    />
  );
};

export const MetadataIcon = () => <Icon width="24px" />;
