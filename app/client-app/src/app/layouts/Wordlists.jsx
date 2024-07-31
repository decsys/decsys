import DefaultAppBar from "./components/DefaultAppBar";
import { Box, Grid } from "@chakra-ui/react";

const WordlistsPage = ({ children, brandLink }) => {
  return (
    <Grid templateRows="54px minmax(20px, 1fr)" height="100vh">
      <DefaultAppBar brandLink={brandLink} />
      {children}
    </Grid>
  );
};

export default WordlistsPage;
