import React from "react";
import { Text, Stack, Tooltip, Icon } from "@chakra-ui/core";
import { FaRegQuestionCircle } from "react-icons/fa";
import { buildControls } from "../helpers";
import { reduceParamTypes } from "@decsys/param-types";

export const ShapeControls = ({ paramType, paramKey, propPath, _context }) => {
  return (
    <Stack key={paramKey} p={2} pt={0} bg="blackAlpha.200" borderRadius={10}>
      <Text p={1} fontWeight="medium" borderBottom="thin solid">
        {paramType.label || paramKey}
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
      </Text>
      {
        reduceParamTypes(paramType.childTypes, buildControls, {
          ..._context,
          parent: {
            node: paramType,
            path: propPath,
          },
        }).controls
      }
    </Stack>
  );
};
