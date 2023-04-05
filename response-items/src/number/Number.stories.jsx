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

export const Basic = (args) => (
  <ResponseItem label={args.label} _context={_context} />
);

Basic.args = {
  label: "Default Label",
};

export const MetadataIcon = () => <Icon width="24px" />;
