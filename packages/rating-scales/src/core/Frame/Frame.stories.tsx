import { Frame } from "./Frame";
import type { StoryObj, Meta } from "@storybook/preact";

const meta: Meta<typeof Frame> = {
  component: Frame,
};
export default meta;

type Story = StoryObj<typeof Frame>;

export const Basic: Story = {};
