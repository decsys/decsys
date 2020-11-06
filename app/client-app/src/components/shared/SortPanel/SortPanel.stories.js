import SortPanel from "components/shared/SortPanel";

export default {
  title: "Shared/SortPanel",
  component: SortPanel,
  argTypes: {
    onSortButtonClick: {
      action: "Sort Button clicked",
    },
    keys: {
      type: "array",
    },
    state: { type: "object" },
  },
  args: {
    state: { key: "name" },
  },
};

export const Basic = (args) => <SortPanel {...args} />;
Basic.args = {
  keys: ["Name", "Order"],
};
