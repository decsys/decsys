import { Grid } from "@chakra-ui/react";
import Div100vh from "react-div-100vh";

const SurveyLayout = ({ children }) => (
  <Div100vh>
    <Grid templateRows="54px minmax(20px, 1fr) 90px" height="100vh">
      {children}
    </Grid>
  </Div100vh>
);

export default SurveyLayout;
