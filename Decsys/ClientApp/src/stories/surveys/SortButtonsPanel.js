import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SortButtonsPanel from "../../app/admin/surveys/SortButtonsPanel";
import { Provider } from "react-redux";
import { configureStore } from "redux-starter-kit";

storiesOf("SortButtonsPanel", module)
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
      {story()}
    </Provider>
  ))
  .add("Empty", () => <SortButtonsPanel />)
  .add("One Field", () => <SortButtonsPanel keys={["Name"]} />)
  .add("Two Fields", () => <SortButtonsPanel keys={["Name", "Thing"]} />)
  .add("Display Labels", () => (
    <SortButtonsPanel
      keys={[
        "Name",
        ["Field with Spaces or Symbols ? @ % $", "field_with_spaces_or_symbols"]
      ]}
    />
  ));
