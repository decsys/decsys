import React, { createRef } from "react";
import PropTypes from "prop-types";
import "./pixi";
import { Application } from "@pixi/app";
import RangeBar from "./RangeBar";
import ScaleLabel from "./ScaleLabel";
import RangeMarker from "./RangeMarker";
import EllipseCanvas, * as Canvas from "./Canvas";
import Pen from "./pen-line";
import Frame from "../core/StyledFrame";
import Question from "../core/StyledQuestion";
import FlexContainer from "../core/StyledBarContainer";
import UnitValue from "unit-value";
import ScaleMarkerSet from "./ScaleMarkerSet";

// private static helpers

const getScrolledY = y => y + window.pageYOffset;

const resizeHandler = (app, main, ...elems) => {
  const { width, height } = Canvas.newDimensions(main, ...elems);
  Canvas.setDimensions(app.view, { width, height });
  app.renderer.resize(width, height);
};

/** An Ellipse Scale */
export default class EllipseScale extends React.Component {
  constructor(props) {
    super(props);
    this.outputs = {};

    this.frame = createRef();
  }

  static propTypes = {
    /**
     * An array of css selectors for elements
     * to be used for calculating canvas height
     */
    heightElements: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),

    /** A valid CSS Dimension value for the height of the component's frame */
    frameHeight: PropTypes.string,

    /** Initial minimum range value */
    minRangeValue: PropTypes.number,

    /** Initial maximum range value */
    maxRangeValue: PropTypes.number,

    /** Options for the Pen Line appearance */
    penOptions: PropTypes.shape({
      /** A valid CSS Color value for the pen line */
      color: PropTypes.string,

      /** A numeric value for the pen line thickness */
      thickness: PropTypes.number
    }),

    /** Options for the scale's question text */
    questionOptions: PropTypes.shape({
      /** A valid CSS Color value for the question color. */
      textColor: PropTypes.string,
      /** A valid CSS Dimension value for the question top margin. */
      topMargin: PropTypes.string,
      /**
       * A valid CSS Dimension value for the question left or right margin.
       *
       * The use of this value depends on alignment. It is ignored for `center` alignment,
       * otherwise it is used as a margin on the aligned side (`left` or `right`).
       */
      xMargin: PropTypes.string,
      /** A valid CSS Font Family value for the question font. */
      fontFamily: PropTypes.string,
      /** A valid CSS Font Size value for the question font size. */
      fontSize: PropTypes.string,
      /** Text alignment of the question within the frame. */
      xAlign: PropTypes.oneOf(["left", "center", "right"])
    }),

    /** Question text to display */
    question: PropTypes.string,

    /** Options for the scale's horizontal bar */
    barOptions: PropTypes.shape({
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
      /** A valid CSS Dimension value for the bar left margin. */
      leftMargin: PropTypes.string,
      /** A valid CSS Dimension value for the bar right margin. */
      rightMargin: PropTypes.string,
      /** A valid CSS Dimension value for the bar top margin. */
      topMargin: PropTypes.string,
      /** A valid CSS Color value for the bar color. */
      barColor: PropTypes.string,
      /** A valid CSS Dimension value for the bar thickness. */
      thickness: PropTypes.string
    }),

    /** Options for the range bar's fixed labels */
    labelOptions: PropTypes.shape({
      /** A valid CSS Color value for the label text */
      labelColor: PropTypes.string,
      /** A valid CSS Font Family value for any labels associated with this Radio component. */
      fontFamily: PropTypes.string,
      /** A valid CSS Font Size value for any labels associated with this Radio component. */
      fontSize: PropTypes.string,
      /** Vertical alignment of the label relative to its position */
      yAlign: PropTypes.oneOf(["above", "center", "below"])
    }),

    /** Fixed label values for the range bar */
    labels: PropTypes.shape({
      /** Label value for the left hand end */
      min: PropTypes.string,
      /** Central label value */
      mid: PropTypes.string,
      /** Label value for the right hand end */
      max: PropTypes.string
    }),

    /** Options for the Range Markers appearance */
    rangeMarkerOptions: PropTypes.shape({
      /** A valid CSS Color value for the marker */
      markerColor: PropTypes.string,
      /** A valid CSS Dimension value for the length of the marker */
      length: PropTypes.string,
      /** A valid CSS Dimension value for the thickness of the marker */
      thickness: PropTypes.string
    }),

    /** Options for the Scale Markers */
    scaleMarkerOptions: PropTypes.shape({
      /** A valid CSS Color value for the marker */
      markerColor: PropTypes.string,
      /** A valid CSS Dimension value for the length of the marker */
      length: PropTypes.string,
      /** A valid CSS Dimension value for the thickness of the marker */
      thickness: PropTypes.string
    })
  };

  static defaultProps = {
    // default all shapes to empty objects
    // so we don't have to null check before accessing children
    penOptions: {},
    questionOptions: {},
    barOptions: {},
    labelOptions: {},
    labels: {},
    rangeMarkerOptions: {},
    scaleMarkerOptions: {}
  };

  componentDidMount() {
    // store these to avoid selecting them everytime
    this.mainElement = this.canvas.parentElement;
    this.heightElements = this.props.heightElements
      ? document.querySelectorAll(this.props.heightElements)
      : [];

    // initialise pixi
    this.app = new Application({
      width: 0,
      height: 0,
      view: this.canvas,
      resolution: window.devicePixelRatio,
      antialias: true,
      transparent: true
    });

    this.pen = new Pen(this.app.stage, this.props.penOptions);

    // Set Initial Range Bar Markers
    this.setRangeMarker(this.minMarker, this.props.minRangeValue, true);
    this.setRangeMarker(this.maxMarker, this.props.maxRangeValue, true);

    // input events
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.pointerdown = e => {
      if (e.data.originalEvent.buttons === 1)
        this.pen.reset({ x: e.data.global.x, y: e.data.global.y });
    };

    this.app.stage.pointermove = e => {
      if (e.data.originalEvent.buttons === 1) {
        const { x, y } = e.data.global;
        // also check we are in the hit area
        // (we don't care for moves outside it)
        if (this.app.stage.hitArea.contains(x, y)) this.pen.addPoint({ x, y });
      }
    };

    this.app.stage.pointerup = () => {
      const { x, y, width } = this.rangeBar.bounds;
      this.pen.closePath(); // complete the ellipse

      const { top, left } = this.canvas.getBoundingClientRect();
      let hits = this.pen.findIntersections(
        getScrolledY(y) - getScrolledY(top)
      );

      // validate the PenLine hits
      if (hits.length !== 1) {
        // offset hits here so we don't clamp wrong
        hits = hits.map(x => x + left);

        // 1 hit is valid outside the line
        //multiple hits have can't all be the same side
        const allLeft = hits.every(hit => hit < x);
        const allRight = hits.every(hit => hit > x + width);
        if (allLeft || allRight) {
          this.resetPenLine(this.pen, 0, 0);
          return;
        }
      }

      // update state if a complete ellipse drawn:
      // get min, max x hits
      const min = Math.min(...hits.map(hit => hit));
      const max = Math.max(...hits.map(hit => hit));

      // Convert and apply them
      this.setRange(min, max);

      // mark completed
      this.outputs.completed = true;

      // Dispatch a completed event from the attached canvas
      document.dispatchEvent(
        new CustomEvent("EllipseCompleted", { detail: this.outputs })
      );
    };

    //hook up the resize handler
    window.onresize = () =>
      resizeHandler(this.app, this.mainElement, ...this.heightElements);

    //also call it now to position and size the canvas at first run
    resizeHandler(this.app, this.mainElement, ...this.heightElements);
  }

  setRange(min, max, values = false) {
    const vmin = values ? min : this.rangeBar.getValueForX(min);
    const vmax = values ? max : this.rangeBar.getValueForX(max);
    // "store" the values
    this.outputs.minRangeValue = vmin;
    this.outputs.maxRangeValue = vmax;
    // Set Range Bar Markers
    this.setRangeMarker(this.minMarker, min, values);
    this.setRangeMarker(this.maxMarker, max, values);
  }

  setRangeMarker(marker, position, isValue = false) {
    if (position == null) marker.style.display = "none";
    else {
      const x = isValue
        ? this.rangeBar.getXPosForValue(position)
        : this.rangeBar.getRelativeXPos(position);
      marker.style.left = `${x}px`;
      marker.style.display = "block";
    }
  }

  resetPenLine(x, y) {
    this.outputs.completed = false;
    this.pen.reset({ x, y });
  }

  render() {
    const labels = [];
    const labelValues = [
      this.props.labels.min,
      this.props.labels.mid,
      this.props.labels.max
    ];
    for (let i = 0; i < labelValues.length; i++) {
      labels.push(
        <ScaleLabel
          key={`scale-label-${i}`}
          labelIndex={i}
          {...this.props.labelOptions}
          value={labelValues[i]}
        />
      );
    }

    // pre-calculate these so they can apply to both markers
    const rangeMarkerProps = {
      markerColor: this.props.rangeMarkerOptions.markerColor,
      thickness:
        this.props.rangeMarkerOptions.thickness != null
          ? this.props.rangeMarkerOptions.thickness
          : this.props.barOptions.thickness,

      length:
        this.props.rangeMarkerOptions.length != null
          ? this.props.rangeMarkerOptions.length
          : UnitValue.multiply(this.props.barOptions.thickness, 1.5).toString()
    };

    // adjust scale marker defaults if necessary
    this.props.scaleMarkerOptions.thickness =
      this.props.scaleMarkerOptions.thickness != null
        ? this.props.scaleMarkerOptions.thickness
        : this.props.barOptions.thickness;
    this.props.scaleMarkerOptions.length =
      this.props.scaleMarkerOptions.length != null
        ? this.props.scaleMarkerOptions.length
        : UnitValue.multiply(this.props.barOptions.thickness, 8).toString();

    return [
      <Frame key="EllipseFrame" frameHeight={this.props.frameHeight}>
        <EllipseCanvas key="EllipseCanvas" ref={e => (this.canvas = e)} />
        <Question {...this.props.questionOptions}>
          {this.props.question}
        </Question>
        <RangeBar ref={e => (this.rangeBar = e)} {...this.props.barOptions}>
          <FlexContainer>
            <ScaleMarkerSet {...this.props.scaleMarkerOptions} />
          </FlexContainer>
          <FlexContainer>{labels}</FlexContainer>
          <RangeMarker {...rangeMarkerProps} ref={e => (this.minMarker = e)} />
          <RangeMarker {...rangeMarkerProps} ref={e => (this.maxMarker = e)} />
        </RangeBar>
      </Frame>
    ];
  }
}
