import React from "react";
import { Router, View, NotFoundBoundary } from "react-navi";
import routes from "./routes";
import AppBar from "./components/AppBar";
import { Container, FlexBox, EmptyState } from "./components/ui";

const App = () => {
  return (
    <Router routes={routes}>
      <NotFoundBoundary
        render={() => (
          <>
            <AppBar brand="DECSYS" />
            <Container>
              <FlexBox mt={5}>
                <EmptyState message="404: Not Found" />
              </FlexBox>
            </Container>
          </>
        )}
      >
        <View /> {/* We don't have any real common layout to speak of */}
      </NotFoundBoundary>
    </Router>
  );
};

export default App;
