import React from "react";
import DefaultAppBar from "./components/DefaultAppBar";
import SurveyLayout from "./components/SurveyLayout";

const Survey = ({ children }) => {
  return (
    <SurveyLayout>
      <DefaultAppBar />
      {children}
    </SurveyLayout>
  );
};

export default Survey;