import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setIsValidResponse: { action: "Next Button toggled" },
};

export default {
  title: "Number",
  component: ResponseItem,
};

export const Basic = () => {
  return (
    <ResponseItem
      defaultValue={0}
      max={10}
      min={-10}
      precision={1}
      _context={_context}
    />
  );
};

export const MetadataIcon = () => <Icon width="24px" />;
