// import { useEffect } from "react";
import { VisualAnalogScale } from "./Scale";
// import { action } from "@storybook/addon-actions";
// import { text } from "@storybook/addon-knobs";

export default {
  title: "Rating Scales/VAS",
  component: VisualAnalogScale,
  // decorators: [
  //   (s) => (
  //     <EventHandler onEvent={action("Ellipse Completed")}>{s()}</EventHandler>
  //   ),
  // ],
};

// const EventHandler = ({ onEvent, children }) => {
//   const handle = ({ detail }) => {
//     onEvent(detail);
//   };

//   useEffect(() => {
//     document.addEventListener("EllipseCompleted", handle);
//     return () => document.removeEventListener("EllipseCompleted", handle);
//   }, []);

//   return children;
// };

export const Basic = () => <VisualAnalogScale />;
