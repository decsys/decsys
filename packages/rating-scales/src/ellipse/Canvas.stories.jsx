import { EllipseCanvas } from "./Canvas";
import { Frame } from "../core/Frame";
import { Button } from "@chakra-ui/react";

export default {
  title: "Ellipse/Canvas",
  component: EllipseCanvas,
  tags: ["autodocs"],
  decorators: [(Story) => <Frame>{<Story />}</Frame>],
  argTypes: {},
};

export const Basic = () => <EllipseCanvas />;
