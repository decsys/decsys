import { Button } from "@chakra-ui/react";
//TODO: Replace action with controls
//import { action } from "@storybook/addon-actions";
import AppBar, { AppBarLink } from "./AppBar";

export default {
  title: "AppBar",
  component: AppBar,
  argTypes: {
    brand: { control: "text" },
    onLinkClick: { action: "Link Clicked" },
    onAnotherLinkClick: { action: "Another Link clicked" },
    onButtonClick: { action: "Button Clicked" },
  },
  //Default args
  args: {
    brand: "My Brand",
  },
};

export const Basic = (args) => <AppBar {...args} />;

export const Brand = (args) => <AppBar brand={args.brand} />;

export const OneChild = (args) => (
  <AppBar>
    <AppBarLink onClick={args.onLinkClick}>Clicky time</AppBarLink>
  </AppBar>
);

export const Children = (args) => (
  <AppBar>
    <AppBarLink onClick={args.onLinkClick}>A link</AppBarLink>
    <AppBarLink onClick={args.onAnotherLinkClick}>Another link</AppBarLink>
    <Button onClick={args.onButtonClick}>Button</Button>
  </AppBar>
);

export const BrandAndChildren = (args) => (
  <AppBar brand={args.brand}>
    <AppBarLink onClick={args.onLinkClick}>A link</AppBarLink>
    <AppBarLink color="yellow.500" onClick={args.onAnotherLinkClick}>
      A custom colored link
    </AppBarLink>
    <Button variant="secondary" onClick={args.onButtonClick}>
      Button
    </Button>
  </AppBar>
);
