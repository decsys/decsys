import ResponseItem from "./ResponseItem";

export default {
  title: "Discrete Scale",
  component: ResponseItem,
  argTypes: {
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    clearResult: { action: "clearResult" },
  },
  args: {
    option0: "Option 1",
  },
};

export const Default = (args, context) => {
  return <ResponseItem {...args} _context={context.args} />;
};
