import LoadingIndicator from "./LoadingIndicator";

export default {
  title: "Core UI/LoadingIndicator",
  component: LoadingIndicator,
  args: {
    verb: "Reticulating",
    noun: "splines",
  },
};

export const Basic = (args) => <LoadingIndicator {...args} />;
