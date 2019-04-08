import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { InfoCircle } from "styled-icons/fa-solid/InfoCircle";
import { AlignLeft } from "styled-icons/fa-solid/AlignLeft";
import {
  Box,
  Typography,
  Textarea,
  colorYik,
  colorVariant
} from "@smooth-ui/core-sc";
import paramTypes, { setParams } from "@decsys/param-types/";

// Build a React component for our FreeText question type
const FreeText = ({ maxLength, initialText, logResults }) => {
  const threshold = maxLength / 10; // right now we fix this at 10% MaxLength

  const [badgeVariant, setBadgeVariant] = useState("info");
  const [value, setValue] = useState(initialText);
  useEffect(() => setValue(initialText), [initialText]);

  const handleInput = ({ target }) => {
    setValue(target.value);
    const count = maxLength - target.value.length;
    if (count === 0) {
      setBadgeVariant("danger");
    } else if (count <= threshold) {
      setBadgeVariant("warning");
    } else {
      setBadgeVariant("info");
    }
  };

  const handleBlur = e => {
    e.persist();
    logResults({ text: e.target.value });
  };

  // TODO: take this re-usably from the Survey Platform's UI, one day...
  const Badge = styled(Typography).attrs(
    ({ backgroundColor = "info", ...p }) => ({
      display: "inline",
      px: 1,
      borderRadius: 8,
      textAlign: "center",
      backgroundColor: backgroundColor,
      color: colorYik(colorVariant(backgroundColor)(p))(p)
    })
  )``;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" p=".1em">
        <Badge p=".2em" backgroundColor={badgeVariant}>
          <InfoCircle size="1em" /> Characters remaining:{" "}
          {maxLength - value.length}/{maxLength}
        </Badge>
      </Box>
      <Textarea
        value={value}
        maxLength={maxLength}
        name="FreeText"
        onChange={handleInput}
        onBlur={handleBlur}
      />
    </Box>
  );
};

//set parameter metadata, including propTypes and defaultProps
setParams(FreeText, {
  maxLength: paramTypes.number("Character Limit", 50)
});

// propTypes and defaultProps for non-parameter props (e.g. results)
FreeText.propTypes = {
  initialText: PropTypes.string
};

FreeText.defaultProps = {
  initialText: ""
};

// Metadata properties
FreeText.version = "0.1.0";
FreeText.icon = React.createElement(AlignLeft);

export default FreeText;
