import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setNextEnabled: action("Next Button toggled"),
  logEvent: action("Custom Event logged"),
  logResults: action("ResponseItem Results logged"),
};

export default {
  title: "Confirmation",
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

export const InitiallyChecked = () => (
  <ResponseItem
    label={text(
      ResponseItem.params.label.label,
      ResponseItem.params.label.defaultValue
    )}
    confirmed={true}
    _context={_context}
  />
);

export const MetadataIcon = () => <Icon width="24px" />;
