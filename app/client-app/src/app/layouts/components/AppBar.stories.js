import { Button } from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import AppBar, { AppBarLink } from "./AppBar";

export default {
  title: "AppBar",
  component: AppBar,
};

const Template = (args) => <AppBar {...args} />;

export const Basic = Template.bind({});

export const WithBrand = Template.bind({});
WithBrand.args = { brand: "My Brand" };

export const WithOneChild = Template.bind({});
WithOneChild.args = {
  children: (
    <AppBarLink onClick={action("Link clicked")}>Clicky time</AppBarLink>
  ),
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: (
    <>
      <AppBarLink onClick={action("Link clicked")}>A link</AppBarLink>
      <AppBarLink onClick={action("Another Link clicked")}>
        Another link
      </AppBarLink>
      <Button onClick={action("Button clicked")}>Button</Button>
    </>
  ),
};

export const WithBrandAndChildren = Template.bind({});
WithBrandAndChildren.args = {
  ...WithBrand.args,
  children: (
    <>
      <AppBarLink onClick={action("Link clicked")}>A link</AppBarLink>
      <AppBarLink color="yellow.500" onClick={action("Another Link clicked")}>
        A custom colored link
      </AppBarLink>
      <Button variant="secondary" onClick={action("Button clicked")}>
        Button
      </Button>
    </>
  ),
};
