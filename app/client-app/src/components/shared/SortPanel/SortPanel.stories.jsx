import SortPanel from "components/shared/SortPanel";

export default {
  title: "Shared/SortPanel",
  component: SortPanel,
  argTypes: {
    onSortButtonClick: { action: "Sort Button clicked" },
    keys: {
      control: {
        type: "array",
        separator: ",",
      },
    },
  },
  //Default args
  args: {
    keys: ["Name", "Order"],
  },
};

export const Basic = (args) => <SortPanel {...args} state={{ key: "name" }} />;
