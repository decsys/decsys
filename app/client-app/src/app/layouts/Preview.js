import React from "react";
import SurveyLayout from "./components/SurveyLayout";
import AppBar, { AppBarLink } from "./components/AppBar";
import { navigate, Link as RouterLink } from "@reach/router";

const Preview = ({ children }) => {
  return (
    <SurveyLayout>
      <AppBar brand="DECSYS - Preview" brandLink="">
        <AppBarLink as={RouterLink} to="" onClick={() => navigate(-1)}>
          Go back
        </AppBarLink>
      </AppBar>

      {children}
    </SurveyLayout>
  );
};

export default Preview;
