import React from "react";
import DefaultAppBar from "./components/DefaultAppBar";
import DefaultContainer from "../../components/shared/DefaultContainer";

const Default = ({ children }) => {
  return (
    <>
      <DefaultAppBar />
      <DefaultContainer>{children}</DefaultContainer>
    </>
  );
};

export default Default;
