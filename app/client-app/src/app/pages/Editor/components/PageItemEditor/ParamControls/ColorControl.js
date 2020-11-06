import React from "react";
import {
  Input,
  Stack,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/core";
import { CgColorPicker } from "react-icons/cg";
import { useDerivedState } from "hooks/useDerivedState";
import { SketchPicker } from "react-color";
import { useDeferredAction } from "hooks/useDeferredAction";

export const ColorControl = ({ paramType, propPath, value = "", onChange }) => {
  const [color, setColor] = useDerivedState(value);

  const deferredHandleChange = useDeferredAction(onChange, 500);

  const handlePickerChange = (color) => {
    setColor(color.hex);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
    deferredHandleChange(propPath, color.hex);
  };

  const handleTextChange = (e) => {
    e.persist(); // TODO: React 17 change
    handleColorChange({ hex: e.target.value });
  };

  return (
    <Stack direction="row">
      <Flex w="30px" css={{ background: color }}></Flex>
      <Input
        w="100px"
        borderColor="gray.400"
        size="sm"
        type="text"
        onChange={handleTextChange}
        value={color}
      />
      <Popover>
        <PopoverTrigger>
          <IconButton size="sm" icon={<CgColorPicker />} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <SketchPicker
              color={color}
              onChange={handlePickerChange}
              onChangeComplete={handleColorChange}
              disableAlpha
              presetColors={[]}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Stack>
  );
};
