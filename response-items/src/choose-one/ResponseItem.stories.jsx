import ResponseItem from "./ResponseItem";

export default {
  title: "Choose One",
  component: ResponseItem,
  argTypes: {
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    clearResult: { action: "clearResult" },
  },
  args: {
    option0: "Option 1",
    option1: "Option 2",
    option2: "Option 3",
    option3: "Option 4",
  },
};

export const Default = (args) => {
  const _context = {
    setIsValidResponse: args.setIsValidResponse,
    logResults: args.logResults,
    clearResult: args.clearResult,
  };
  return <ResponseItem {...args} _context={_context} />;
};
