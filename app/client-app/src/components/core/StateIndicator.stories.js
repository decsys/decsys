import { FaCheck, FaEllipsisH, FaTimes } from "react-icons/fa";
import { StateIndicator, statePresets } from "./StateIndicator";

export default {
  title: "Core UI/StateIndicator",
  component: StateIndicator,
};

export const Incomplete = () => (
  <StateIndicator state={statePresets.inactive} />
);
export const Complete = () => <StateIndicator state={statePresets.active} />;

export const Skipped = () => (
  <StateIndicator
    state={{ label: "Skipped", color: "yellow.300", icon: FaEllipsisH }}
  />
);
