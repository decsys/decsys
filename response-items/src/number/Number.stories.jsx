import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setIsValidResponse: () => {},
  logResults: () => {},
};

export default {
  title: "Number",
  component: ResponseItem,
};

export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    min: ResponseItem.params.min.defaultValue,
    max: ResponseItem.params.max.defaultValue,
    defaultValue: ResponseItem.params.defaultValue.defaultValue,
    precision: ResponseItem.params.precision.defaultValue,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
