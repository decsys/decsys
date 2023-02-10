import SurveyLayout from "./components/SurveyLayout";
import AppBar, { AppBarLink } from "./components/AppBar";
import { navigate, useLocation } from "@reach/router";

const Preview = ({ children }) => {
  const location = useLocation();
  return (
    <SurveyLayout>
      <AppBar brand="DECSYS - Preview" brandLink="">
        <AppBarLink
          onClick={() => navigate(location?.state?.backRedirect ?? -1)}
        >
          Go back
        </AppBarLink>
      </AppBar>

      {children}
    </SurveyLayout>
  );
};

export default Preview;
