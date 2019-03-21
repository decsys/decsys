import React, { useState, useEffect } from "react";
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

  const [value, setValue] = useState(name); // we use local state so updates work without delay
  useEffect(() => setValue(name), [name]); // but still ensure update when new name props come in

  const handleChange = e => {
    setValue(e.target.value); //update local state
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(e), 1000));
  };

  return (
    <>
      <FlexBox style={{ position: "relative" }}>
        <Input
          size="lg"
          width={1}
          value={value}
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
