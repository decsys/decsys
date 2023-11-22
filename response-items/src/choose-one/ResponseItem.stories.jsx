import ResponseItem from "./ResponseItem";

export default {
  title: "Choose One",
  component: ResponseItem,
  argTypes: {
    logResults: { action: "logResults" },
  },
  args: {
    option0: "Option 1",
    option1: "Option 2",
    option2: "Option 3",
    option3: "Option 4",
  },
};

export const Basic = (args) => {
  const _context = {
    logResults: args.logResults,
  };
  return <ResponseItem {...args} _context={_context} />;
};
