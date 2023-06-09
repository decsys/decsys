//TODO: Replace action with controls
//import { action } from "@storybook/addon-actions";
import { ToggleButton } from "components/core";

export default { title: "Core UI/ToggleButton" };

export const WithText = () => (
  <ToggleButton
  //onClick={action("toggled!")}
  >
    Hello
  </ToggleButton>
);
