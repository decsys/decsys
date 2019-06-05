import React from "react";
import PropTypes from "prop-types";
import Frame from "../core/StyledFrame";
import ScaleBar from "../core/StyledScaleBar";
import Question from "../core/StyledQuestion";
import FlexContainer from "../core/StyledBarContainer";
import Radio from "./Radio";

/** A Discrete Scale */
export default class DiscreteScale extends React.Component {
  static propTypes = {
    /** Options for the scale's radio inputs */
    radioOptions: PropTypes.shape({
      /** A valid CSS Color value for all label text */
      labelColor: PropTypes.string,
      /** A valid CSS Font Family value for all label text. */
      fontFamily: PropTypes.string,
      /** A valid CSS Font Size value for the label text. */
      fontSize: PropTypes.string,
      /** Whether labels should be `above` or `below` radio inputs. */
      labelAlignment: PropTypes.oneOf(["above", "below"]),
      /** Which one, if any, of the radio inputs specified,
       * should start selected, by array index. */
      initialIndex: PropTypes.number
    }),

    /** The actual radio input values, and optional secondary labels. */
    radios: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,

    /** A valid CSS Dimension value for the height of the component's frame */
    frameHeight: PropTypes.string,

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
    })
  };

  static defaultProps = {
    barOptions: {},
    questionOptions: {},
    radioOptions: {
      labelAlignment: "below"
    },
    radios: [["1"]]
  };

  render() {
    const radios = [];
    for (let i = 0; i < this.props.radios.length; i++) {
      const id = `radio${i + 1}`;
      radios.push(
        <Radio
          {...this.props.radioOptions}
          labelAbove={this.props.radioOptions.labelAlignment === "above"}
          id={id}
          key={id}
          index={i}
          defaultChecked={this.props.radioOptions.initialIndex === i}
          value={this.props.radios[i][0]}
          secondaryLabel={this.props.radios[i][1]}
        />
      );
    }

    return (
      <Frame frameHeight={this.props.frameHeight}>
        <Question {...this.props.questionOptions}>
          {this.props.question}
        </Question>
        <ScaleBar {...this.props.barOptions}>
          <FlexContainer>{radios}</FlexContainer>
        </ScaleBar>
      </Frame>
    );
  }
}
