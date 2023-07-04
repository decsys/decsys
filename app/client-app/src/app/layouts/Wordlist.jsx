import DefaultAppBar from "./components/DefaultAppBar";
import { Box, Grid } from "@chakra-ui/react";

const WordlistPage = ({ children, brandLink }) => {
  return (
    <Grid>
      <DefaultAppBar brandLink={brandLink} />
      {children}
    </Grid>
  );
};

export default WordlistPage;
