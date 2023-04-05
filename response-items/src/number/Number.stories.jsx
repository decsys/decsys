import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
};

export default {
  title: "Number",
  component: ResponseItem,
};

export const Basic = () => (
  <ResponseItem
    label={text(
      ResponseItem.params.label.label,
      ResponseItem.params.label.defaultValue
    )}
    _context={_context}
  />
);

export const MetadataIcon = () => <Icon width="24px" />;
