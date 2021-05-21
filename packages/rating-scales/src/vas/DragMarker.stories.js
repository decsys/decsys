import { DragMarker } from "./DragMarker";
import { action } from "@storybook/addon-actions";

export default {
  title: "VAS/DragMarker",
  component: DragMarker,
};

export const Basic = () => <DragMarker yAnchor={100} />;
