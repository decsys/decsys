import SortButton from "components/shared/SortPanel/SortButton";

export default {
  title: "Shared/SortButton",
  component: SortButton,
  argTypes: {
    active: { control: "boolean", defaultValue: false },
    asc: { control: "boolean", defaultValue: false },
    children: { control: "text", defaultValue: "Name" },
    onClick: { action: "SortButton clicked" },
  },
  //Default Control
  args: {
    active: false,
    asc: false,
    children: "Name",
  },
};

export const Basic = (args) => <SortButton {...args} />;
