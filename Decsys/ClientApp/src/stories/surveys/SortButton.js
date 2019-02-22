import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { SortButton } from "../../app/admin/surveys/SortButton";
import { Cat } from "styled-icons/fa-solid";

storiesOf("SortButton", module)
  .add("Default", () => (
    <SortButton
      sortby="name"
      current={{ key: "NotName" }}
      dispatch={action("SortButton clicked")}
    />
  ))
  .add("Text", () => (
    <SortButton
      sortby="name"
      current={{ key: "NotName" }}
      dispatch={action("SortButton clicked")}
    >
      Sort me
    </SortButton>
  ))
  .add("Ascending sort", () => (
    <SortButton
      sortby="name"
      current={{ key: "NotName", name: true }}
      dispatch={action("SortButton clicked")}
    >
      Sort me
    </SortButton>
  ))
  .add("Active", () => (
    <SortButton
      sortby="name"
      current={{ key: "name" }}
      dispatch={action("SortButton clicked")}
    >
      Sort me
    </SortButton>
  ))
  .add("Icons and stuff", () => (
    <SortButton
      sortby="name"
      current={{ key: "NotName" }}
      dispatch={action("SortButton clicked")}
    >
      <Cat /> Miaow!
    </SortButton>
  ))
  .add("Pass on button props", () => (
    <SortButton
      sortby="name"
      current={{ key: "NotName" }}
      dispatch={action("SortButton clicked")}
      variant="primary"
      borderRadius={50}
    >
      Sort me
    </SortButton>
  ));
