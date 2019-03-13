import React from "react";
import { storiesOf } from "@storybook/react";
import SurveyCard from "./SurveyCard";

storiesOf("SurveyCard", module)
  .add("Default (inactive)", () => <SurveyCard />)
  .add("Active", () => <SurveyCard active />)
  .add("Name", () => <SurveyCard name="My Survey" active />);
