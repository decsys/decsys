import React, { createElement } from "react";
import { types } from "@decsys/param-types";
import {
  FormControl,
  FormLabel,
  Grid,
  Flex,
  Tooltip,
  Icon,
} from "@chakra-ui/core";
import { StringControl } from "./StringControl";
import { IntegerControl } from "./IntegerControl";
import { BoolControl } from "./BoolControl";
import { OneOfControl } from "./OneOfControl";
import { ArrayControl } from "./ArrayControl";
import { ColorControl } from "./ColorControl";
import { FaRegQuestionCircle } from "react-icons/fa";

const ParamControl = (p) => {
  const {
    paramType: { type },
  } = p;

  const controlMap = {
    [types.string]: StringControl,
    [types.integer]: IntegerControl,
    [types.bool]: BoolControl,
    [types.oneOf]: OneOfControl,
    [types.arrayOf]: ArrayControl,
    [types.color]: ColorControl,
  };

  if (!Object.keys(controlMap).includes(type))
    throw new Error(`Unknown Parameter type: ${type}`);

  return createElement(controlMap[type], p);
};

const ControlsGrid = (p) => (
  <FormControl
    as={Grid}
    templateColumns="2fr 5fr"
    gap={2}
    alignItems="center"
    width="100%"
    {...p}
  />
);

export const ParamControlRow = ({
  value,
  paramType,
  paramKey,
  propPath,
  handleParamChange,
}) => {
  const isLabelledType = paramType.type !== "bool";

  return (
    <ControlsGrid>
      <Flex justify="flex-end">
        <FormLabel
          textAlign="right"
          fontWeight="medium"
          color={isLabelledType ? "inherit" : "gray.400"}
          m={0}
        >
          {isLabelledType ? paramType.label || paramKey : " ~ "}
        </FormLabel>
        {paramType.info && (
          <Tooltip
            shouldWrapChildren
            hasArrow
            openDelay={200}
            label={paramType.info}
          >
            <sup>
              <Icon color="gray.500" m={1} as={FaRegQuestionCircle} />
            </sup>
          </Tooltip>
        )}
      </Flex>

      <ParamControl
        value={value}
        paramType={paramType}
        paramKey={paramKey}
        propPath={propPath}
        onChange={handleParamChange}
      />
    </ControlsGrid>
  );
};
