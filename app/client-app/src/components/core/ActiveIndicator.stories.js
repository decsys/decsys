import React from "react";
import ActiveIndicator from "./ActiveIndicator";

export default {
  title: "Core UI/ActiveIndicator",
  component: ActiveIndicator
};

export const Inactive = () => <ActiveIndicator />;
export const Active = () => <ActiveIndicator active />;
