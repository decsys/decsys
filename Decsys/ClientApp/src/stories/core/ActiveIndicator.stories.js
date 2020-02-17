import React from "react";
import { ActiveIndicator } from "components/core";

export default {
  title: "Core UI/ActiveIndicator",
  component: ActiveIndicator
};

export const inactive = () => <ActiveIndicator />;
export const active = () => <ActiveIndicator active />;
