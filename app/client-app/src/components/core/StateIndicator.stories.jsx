import { FaEllipsisH } from "react-icons/fa";
import { StateIndicator, statePresets } from "./StateIndicator";

const story = {
  title: "Core UI/StateIndicator",
  component: StateIndicator,
};
export default story;

export const Incomplete = () => (
  <StateIndicator state={statePresets.inactive} />
);
export const Complete = () => <StateIndicator state={statePresets.active} />;

export const Skipped = () => (
  <StateIndicator
    state={{ label: "Skipped", color: "yellow.300", icon: FaEllipsisH }}
  />
);
