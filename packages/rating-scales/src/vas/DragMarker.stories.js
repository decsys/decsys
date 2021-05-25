import { DragMarker } from "./DragMarker";

export default {
  title: "VAS/DragMarker",
  component: DragMarker,
};

const BoundMarker = ({ xPos }) => (
  <div
    style={{
      position: "absolute",
      minHeight: "50vh",
      color: "red",
      left: xPos,
      borderLeft: "thin solid red",
    }}
  ></div>
);

export const Basic = () => <DragMarker yAnchor={100} xInit={20} />;

export const WithBounds = () => (
  <>
    <BoundMarker xPos="200px" />
    <BoundMarker xPos="400px" />
    <DragMarker yAnchor={100} xMin={200} xMax={400} xInit={300} />
  </>
);

export const Labelled = () => <DragMarker label="L" yAnchor={100} xInit={20} />;
