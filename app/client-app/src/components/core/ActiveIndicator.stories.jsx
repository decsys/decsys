import { ActiveIndicator } from "./StateIndicator";

export default {
  title: "Core UI/ActiveIndicator",
  component: ActiveIndicator,
};

export const Inactive = () => <ActiveIndicator />;
export const Active = () => <ActiveIndicator active />;
