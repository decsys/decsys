import { Grid } from "@chakra-ui/react";
import Div100vh from "react-div-100vh";

const SurveyLayout = ({ children }) => (
  <Div100vh>
    <Grid templateRows="54px minmax(20px, 1fr) 60px" height="100%">
      {children}
    </Grid>
  </Div100vh>
);

export default SurveyLayout;
