import React from "react";
import { storiesOf } from "@storybook/react";
import Survey from "../../app/admin/surveys/Survey";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-starter-kit";
import Container from "../../app/common/Container";

storiesOf("Survey", module)
  .addDecorator(story => (
    <Provider
      store={configureStore({
        reducer: () => ({
          admin: {
            surveys: {
              sort: { key: "name" }
            }
          }
        })
      })}
    >
      <BrowserRouter>
        <Container>{story()}</Container>
      </BrowserRouter>
    </Provider>
  ))
  .add("Default", () => <Survey />)
  .add("with Name", () => <Survey name="My Survey" />)
  .add("with 0 runs", () => <Survey name="My Survey" runCount={0} />)
  .add("with some runs", () => <Survey name="My Survey" runCount={1} />)
  .add("Launching allowed", () => (
    <Survey name="My Survey" runCount={1} allowLaunch />
  ))
  .add("Currently active", () => (
    <Survey name="My Survey" runCount={1} active />
  ));
