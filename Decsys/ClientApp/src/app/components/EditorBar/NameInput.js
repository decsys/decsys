import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "@smooth-ui/core-sc";
import { FlexBox, RotatingSpinner } from "../ui";
import { Check } from "styled-icons/fa-solid";
import { fadeOut } from "../../utils/keyframes";

const IconDiv = styled.div`
  position: absolute;
  width: 100%;
  text-align: right;
  padding: 12px;
  pointer-events: none;
`;

const StyledCheck = styled(Check)`
  color: ${({ theme }) => theme.success};
  animation: ${fadeOut} 2s 2s linear forwards;
`;

const NameInput = ({ name, saving, saved, onChange, disabled }) => {
  const [timer, setTimer] = useState();
  const handleChange = e => {
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(e), 2000));
  };

  return (
    <>
      <FlexBox style={{ position: "relative" }}>
        <Input
          size="lg"
          width={1}
          value={name}
          borderRadius={0}
          onChange={handleChange}
          disabled={disabled}
        />
        {(saving || saved) && (
          <IconDiv>
            {saving && <RotatingSpinner size="1em" />}
            {saved && <StyledCheck size="1em" />}
          </IconDiv>
        )}
      </FlexBox>
    </>
  );
};

NameInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  saving: PropTypes.bool,
  saved: PropTypes.bool
};

export default NameInput;
