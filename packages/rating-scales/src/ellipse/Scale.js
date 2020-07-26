import React, {
  createRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import EllipseCanvas, { ellipseCanvasPropTypes } from "./Canvas";
import Frame, { framePropTypes } from "../core/Frame";
import Question, { questionPropTypes } from "../core/Question";
import ScaleBar, { scaleBarPropTypes } from "../core/ScaleBar";

// private static helpers

const getScrolledY = (y) => y + window.pageYOffset;

/** An Ellipse Scale */
const EllipseScale = ({
  frameHeight,
  minRangeValue,
  maxRangeValue,
  penOptions,
  question,
  questionOptions,
  barOptions,
}) => {
  const [outputs, setOutputs] = useState({
    minRangeValue,
    maxRangeValue,
  });

  const canvasRef = useRef();

  return (
    <Frame frameHeight={frameHeight}>
      <EllipseCanvas ref={canvasRef} {...penOptions} />
      <Question {...questionOptions}>{question}</Question>
      <ScaleBar {...barOptions}></ScaleBar>
    </Frame>
  );
};
EllipseScale.propTypes = {
  ...framePropTypes,

  /** Initial minimum range value */
  minRangeValue: PropTypes.number,

  /** Initial maximum range value */
  maxRangeValue: PropTypes.number,

  /** Options for the Pen Line appearance */
  penOptions: PropTypes.shape(ellipseCanvasPropTypes),

  /** Options for the scale's question text */
  questionOptions: PropTypes.shape(questionPropTypes),

  /** Question text to display */
  question: PropTypes.string,

  /** Options for the scale's horizontal bar */
  barOptions: PropTypes.shape({
    ...scaleBarPropTypes,
    /**
     * The numeric value of the left hand end of the range bar
     * (the minimum possible value of the range)
     */
    minValue: PropTypes.number.isRequired,
    /**
     * The numeric value of the right hand end of the range bar
     * (the maximum possible value of the range)
     */
    maxValue: PropTypes.number.isRequired,
  }),
};

export default EllipseScale;

// class OldEllipseScale extends React.Component {
//   constructor(props) {
//     super(props);
//     this.outputs = {};

//     this.frame = createRef();
//   }

//   static propTypes = {

//     /** Options for the range bar's fixed labels */
//     labelOptions: PropTypes.shape({
//       /** A valid CSS Color value for the label text */
//       labelColor: PropTypes.string,
//       /** A valid CSS Font Family value for any labels associated with this Radio component. */
//       fontFamily: PropTypes.string,
//       /** A valid CSS Font Size value for any labels associated with this Radio component. */
//       fontSize: PropTypes.string,
//       /** Vertical alignment of the label relative to its position */
//       yAlign: PropTypes.oneOf(["above", "center", "below"]),
//     }),

//     /** Fixed label values for the range bar */
//     labels: PropTypes.shape({
//       /** Label value for the left hand end */
//       min: PropTypes.string,
//       /** Central label value */
//       mid: PropTypes.string,
//       /** Label value for the right hand end */
//       max: PropTypes.string,
//     }),

//     /** Options for the Range Markers appearance */
//     rangeMarkerOptions: PropTypes.shape({
//       /** A valid CSS Color value for the marker */
//       markerColor: PropTypes.string,
//       /** A valid CSS Dimension value for the length of the marker */
//       length: PropTypes.string,
//       /** A valid CSS Dimension value for the thickness of the marker */
//       thickness: PropTypes.string,
//     }),

//     /** Options for the Scale Markers */
//     scaleMarkerOptions: PropTypes.shape({
//       /** A valid CSS Color value for the marker */
//       markerColor: PropTypes.string,
//       /** A valid CSS Dimension value for the length of the marker */
//       length: PropTypes.string,
//       /** A valid CSS Dimension value for the thickness of the marker */
//       thickness: PropTypes.string,
//     }),
//   };

//   static defaultProps = {
//     // default all shapes to empty objects
//     // so we don't have to null check before accessing children
//     penOptions: {},
//     questionOptions: {},
//     barOptions: {},
//     labelOptions: {},
//     labels: {},
//     rangeMarkerOptions: {},
//     scaleMarkerOptions: {},
//   };

//   componentDidUpdate() {
//     this.pen.setOptions(this.props.penOptions);
//   }

//   componentDidMount() {
//     // store these to avoid selecting them everytime
//     this.mainElement = this.canvas.parentElement;
//     this.heightElements = this.props.heightElements
//       ? document.querySelectorAll(this.props.heightElements)
//       : [];

//     // initialise pixi
//     this.app = new Application({
//       width: 0,
//       height: 0,
//       view: this.canvas,
//       resolution: window.devicePixelRatio,
//       antialias: true,
//       transparent: true,
//     });

//     this.pen = new Pen(this.app.stage, this.props.penOptions);

//     // Set Initial Range Bar Markers
//     this.setRangeMarker(this.minMarker, this.props.minRangeValue, true);
//     this.setRangeMarker(this.maxMarker, this.props.maxRangeValue, true);

//     // input events
//     this.app.stage.interactive = true;
//     this.app.stage.hitArea = this.app.screen;

//     this.app.stage.pointerdown = (e) => {
//       if (e.data.buttons === 1)
//         this.pen.reset({ x: e.data.global.x, y: e.data.global.y });
//     };

//     this.app.stage.pointermove = (e) => {
//       if (e.data.buttons === 1) {
//         const { x, y } = e.data.global;
//         // also check we are in the hit area
//         // (we don't care for moves outside it)
//         if (this.app.stage.hitArea.contains(x, y)) this.pen.addPoint({ x, y });
//       }
//     };

//     this.app.stage.pointerup = () => {
//       const { x, y, width } = this.rangeBar.bounds;
//       this.pen.closePath(); // complete the ellipse

//       const { top, left } = this.canvas.getBoundingClientRect();
//       let hits = this.pen.findIntersections(
//         getScrolledY(y) - getScrolledY(top)
//       );

//       // validate the PenLine hits
//       if (hits.length !== 1) {
//         // offset hits here so we don't clamp wrong
//         hits = hits.map((x) => x + left);

//         // 1 hit is valid outside the line
//         //multiple hits have can't all be the same side
//         const allLeft = hits.every((hit) => hit < x);
//         const allRight = hits.every((hit) => hit > x + width);
//         if (allLeft || allRight) {
//           this.resetPenLine(this.pen, 0, 0);
//           return;
//         }
//       }

//       // update state if a complete ellipse drawn:
//       // get min, max x hits
//       const min = Math.min(...hits.map((hit) => hit));
//       const max = Math.max(...hits.map((hit) => hit));

//       // Convert and apply them
//       this.setRange(min, max);

//       // mark completed
//       this.outputs.completed = true;

//       // Dispatch a completed event from the attached canvas
//       document.dispatchEvent(
//         new CustomEvent("EllipseCompleted", { detail: this.outputs })
//       );
//     };

//     //hook up the resize handler
//     window.onresize = () =>
//       resizeHandler(this.app, this.mainElement, ...this.heightElements);

//     //also call it now to position and size the canvas at first run
//     resizeHandler(this.app, this.mainElement, ...this.heightElements);
//   }

//   setRange(min, max, values = false) {
//     const vmin = values ? min : this.rangeBar.getValueForX(min);
//     const vmax = values ? max : this.rangeBar.getValueForX(max);
//     // "store" the values
//     this.outputs.minRangeValue = vmin;
//     this.outputs.maxRangeValue = vmax;
//     // Set Range Bar Markers
//     this.setRangeMarker(this.minMarker, min, values);
//     this.setRangeMarker(this.maxMarker, max, values);
//   }

//   setRangeMarker(marker, position, isValue = false) {
//     if (position == null) marker.style.display = "none";
//     else {
//       const x = isValue
//         ? this.rangeBar.getXPosForValue(position)
//         : this.rangeBar.getRelativeXPos(position);
//       marker.style.left = `${x}px`;
//       marker.style.display = "block";
//     }
//   }

//   resetPenLine(x, y) {
//     this.outputs.completed = false;
//     this.pen.reset({ x, y });
//   }

//   render() {
//     const labels = [];
//     const labelValues = [
//       this.props.labels.min,
//       this.props.labels.mid,
//       this.props.labels.max,
//     ];
//     for (let i = 0; i < labelValues.length; i++) {
//       labels.push(
//         <ScaleLabel
//           key={`scale-label-${i}`}
//           labelIndex={i}
//           {...this.props.labelOptions}
//           value={labelValues[i]}
//         />
//       );
//     }

//     // pre-calculate these so they can apply to both markers
//     const rangeMarkerProps = {
//       markerColor: this.props.rangeMarkerOptions.markerColor,
//       thickness:
//         this.props.rangeMarkerOptions.thickness != null
//           ? this.props.rangeMarkerOptions.thickness
//           : this.props.barOptions.thickness,

//       length:
//         this.props.rangeMarkerOptions.length != null
//           ? this.props.rangeMarkerOptions.length
//           : UnitValue.multiply(this.props.barOptions.thickness, 1.5).toString(),
//     };

//     // adjust scale marker defaults if necessary
//     this.props.scaleMarkerOptions.thickness =
//       this.props.scaleMarkerOptions.thickness != null
//         ? this.props.scaleMarkerOptions.thickness
//         : this.props.barOptions.thickness;
//     this.props.scaleMarkerOptions.length =
//       this.props.scaleMarkerOptions.length != null
//         ? this.props.scaleMarkerOptions.length
//         : UnitValue.multiply(this.props.barOptions.thickness, 8).toString();

//     return [
//       <Frame key="EllipseFrame" frameHeight={this.props.frameHeight}>
//         <EllipseCanvas key="EllipseCanvas" ref={(e) => (this.canvas = e)} />
//         <Question {...this.props.questionOptions}>
//           {this.props.question}
//         </Question>
//         <RangeBar ref={(e) => (this.rangeBar = e)} {...this.props.barOptions}>
//           <FlexContainer>
//             <ScaleMarkerSet {...this.props.scaleMarkerOptions} />
//           </FlexContainer>
//           <FlexContainer>{labels}</FlexContainer>
//           <RangeMarker
//             {...rangeMarkerProps}
//             ref={(e) => (this.minMarker = e)}
//           />
//           <RangeMarker
//             {...rangeMarkerProps}
//             ref={(e) => (this.maxMarker = e)}
//           />
//         </RangeBar>
//       </Frame>,
//     ];
//   }
// }
