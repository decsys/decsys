import SurveyLayout from "./components/SurveyLayout";
import AppBar, { AppBarLink } from "./components/AppBar";
import { navigate } from "@reach/router";

const Preview = ({ children }) => {
  return (
    <SurveyLayout>
      <AppBar brand="DECSYS - Preview" brandLink="">
        <AppBarLink onClick={() => navigate(-1)}>Go back</AppBarLink>
      </AppBar>

      {children}
    </SurveyLayout>
  );
};

export default Preview;
