import { text, radios, color, boolean } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Choose One Response",
  component: ResponseItem,
};

const _context = {
  logResults: action("Results logged"),
  setNextEnabled: action("Next button enabled"),
};

const styles = () => {
  return {
    alignment: radios(
      "Alignment",
      {
        left: "left",
        center: "center",
        right: "right",
      },
      "center"
    ),
    width: text("Width", "50%"),
    textColor: color("Text Color", "black"),
    fontSize: text("Text Size", "1em"),
    fontFamily: text("Text Font", "Arial"),
  };
};

const options = () => {
  return {
    option0: text("Option 0", "Option 0"),
    option1: text("Option 1", "Option 1"),
    option2: text("Option 2", "Option 2"),
    option3: text("Option 3", "Option 3"),
    option4: text("Option 4", ""),
    option5: text("Option 5", ""),
    option6: text("Option 6", ""),
    option7: text("Option 7", ""),
    option8: text("Option 8", ""),
    option9: text("Option 9", ""),
  };
};

const props = () => {
  return { _context, ...options(), ...styles() };
};

export const WithKnobs = () => {
  return <ResponseItem dropDown={boolean("Drop Down", true)} {...props()} />;
};

export const DropDown = () => {
  return (
    <div style={{ marginTop: "50px" }}>
      <ResponseItem dropDown={true} {...props()} />
      <div style={{ height: "100px", width: "100%", backgroundColor: "red" }} />
    </div>
  );
};

export const RadioList = () => {
  return <ResponseItem dropDown={false} {...props()} />;
};

export const OptionValueNotPropOrderBased = () => (
  <ResponseItem
    _context={_context}
    dropDown={false}
    option8=""
    option7=""
    option6=""
    option0="All of the time"
    option1="Most of the time"
    option2="A good bit of the time"
    option9=""
    option3="Some of the time"
    option4="A little bit of the time"
    option5="None of the time"
  />
);

export const MetadataIcon = () => <Icon width="24px" />;
