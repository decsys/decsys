import React from "react";
import { number } from "@storybook/addon-knobs";
import RunCountBadge from "components/SurveyCard/RunCountBadge";

export default {
  title: "Admin/SurveyCard/RunCountBadge",
  component: RunCountBadge
};

export const Basic = () => <RunCountBadge />;

export const nRuns = () => <RunCountBadge count={number("count", 5)} />;
