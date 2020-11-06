import SortButton from "components/shared/SortPanel/SortButton";

export default {
  title: "Shared/SortButton",
  component: SortButton,
  argTypes: {
    onClick: { action: "SortButton clicked" },
    children: { type: "string", name: "Sort Field Label" },
  },
};

export const Basic = (args) => <SortButton {...args} />;
Basic.args = { children: "Name" };
