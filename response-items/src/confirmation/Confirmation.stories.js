import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setNextEnabled: () => {},
  logEvent: () => {},
  logResults: () => {},
};

export default {
  title: "Confirmation",
  component: ResponseItem,
  argTypes: {
    // setNextEnabled: (enabled) => console.log("Next Button toggled:", enabled),
    // logEvent: (event) => console.log("Custom Event logged:", event),
    // logResults: (results) => console.log("ResponseItem Results logged:", results),

    setNextEnabled: { action: "Next Button toggled" },
    logEvent: { action: "Custom Event logged" },
    logResults: { action: "ResponseItem Results logged" },
  },
};

export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    label: ResponseItem.params.label.defaultValue,
  },
};

export const InitiallyChecked = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    label: ResponseItem.params.label.defaultValue,
    confirmed: true,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
