import React from "react";
import PropTypes from "prop-types";
import { InfoCircle } from "styled-icons/fa-solid/InfoCircle";
import { AlignLeft } from "styled-icons/fa-solid/AlignLeft";

// Build a React component for our FreeText question type
const FreeText = ({ maxLength, initialText }) => {
  const threshold = maxLength / 10; // right now we fix this at 10% MaxLength

  const [badgeVariant, setBadgeVariant] = React.useState("info");
  const [value, setValue] = React.useState(initialText);
  React.useEffect(() => setValue(initialText), [initialText]);

  // these become references to elements when the component is rendered
  let message, counter, ta;

  // Input handler to update the shiny character limit counter
  const handleInput = e => {
    const count = maxLength - value.length;
    setValue(e.target.value);
    if (count === 0) {
      setBadgeVariant("danger");
    } else if (count <= threshold) {
      setBadgeVariant("warning");
    } else {
      setBadgeVariant("info");
    }
  };

  return (
    <>
      <div>
        {/* update to a smooth ui or decsys badge */}
        <InfoCircle size="1em" /> Characters remaining:{" "}
        {maxLength - value.length}/{maxLength}
      </div>
      <textarea
        value={value}
        maxLength={maxLength}
        name="FreeText"
        onInput={handleInput}
      />
    </>
  );

  // sadly we don't use JSX in here as this file doesn't go through babel :(
  return React.createElement(
    "div",
    { className: "form-group" },
    React.createElement(
      "div",
      {
        className: "badge badge-info mb-1",
        ref: function ref(e) {
          return (message = e);
        }
      },
      React.createElement("span", { className: "fas fa-fw fa-info-circle" }),
      React.createElement(InfoCircle, { size: "1em" }),
      "Characters remaining\xA0",
      React.createElement(
        "span",
        {
          ref: function ref(e) {
            return (counter = e);
          }
        },
        maxLength - initialText.length
      ),
      "/",
      maxLength
    ),
    React.createElement("textarea", {
      className: "form-control",
      name: "FreeText",
      maxLength: maxLength,
      defaultValue: initialText,
      ref: function ref(e) {
        return (ta = e);
      },
      onInput: handleInput
    })
  );
};

FreeText.propTypes = {
  initialText: PropTypes.string,
  maxLength: PropTypes.number
};

FreeText.defaultProps = {
  maxLength: 10,
  initialText: ""
};

// Metadata properties
FreeText.version = "0.1.0";
FreeText.icon = React.createElement(AlignLeft);

export default FreeText;
