import React from "react";
import { ActiveIndicator } from "components/core";

export default {
  title: "Core UI/ActiveIndicator",
  component: ActiveIndicator
};

export const Inactive = () => <ActiveIndicator />;
export const Active = () => <ActiveIndicator active />;
