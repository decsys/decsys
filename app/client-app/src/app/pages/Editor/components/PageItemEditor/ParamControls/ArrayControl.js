import React, { useState, useEffect, Fragment } from "react";
import { types } from "@decsys/param-types";
import { Stack, Button, Flex, IconButton } from "@chakra-ui/core";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { buildControls } from "../helpers";
import { useDerivedState } from "hooks/useDerivedState";
import { reduceParamTypes } from "@decsys/param-types";
import { set } from "lodash-es";

export const ArrayControl = ({ value = [], paramType, propPath, onChange }) => {
  const [items, setItems] = useDerivedState(value);
  const [itemControls, setItemControls] = useState([]);
  const { childType, limit } = paramType;

  useEffect(() => {
    // Rebuild our (and our children's) controls tree
    setItemControls(
      reduceParamTypes(
        Array(items.length)
          .fill(1)
          .map((_, i) => ({
            ...childType,
            // add ordering to child labels
            // also count from 1 in the UI ;)
            label: !!childType.label ? `${childType.label} ${i + 1}` : i + 1,
          })),
        buildControls,
        {
          params: items,
          handleParamChange: (paramPath, value) => {
            setItems((items) => {
              set(items, paramPath, value);
              return [...items];
            });
            onChange(`${propPath}.${paramPath}`, value);
          },
          parent: {
            node: paramType,
            path: propPath,
          },
        }
      ).controls
    );
  }, [items, onChange, propPath, childType, paramType, setItems]);

  const handleAddItem = () => {
    if (limit && limit <= items.length) {
      console.error(`Array items limit reached: ${limit}`);
      return;
    }

    const defaultValue = (() => {
      switch (childType.type) {
        case types.shape:
          return {};
        case types.arrayOf:
          return [];
        default:
          return childType.default;
      }
    })();

    // set our own local state
    const newItems = [...items, defaultValue];
    setItems(newItems);

    onChange(propPath, newItems);

    // TODO: API
  };

  const handleDeleteItem = (i) => {
    // TODO: API
    setItems((items) => {
      items.splice(i, 1);
      return [...items];
    });
    // TODO: onChange()
  };

  return (
    <>
      <Stack direction="row">
        <Button
          size="sm"
          colorScheme="green"
          variant="outline"
          onClick={handleAddItem}
          leftIcon={<FaPlusCircle />}
          lineHeight={0}
          disabled={limit <= items.length}
        >
          Add item
        </Button>
        {limit && (
          <Flex align="center" color="gray.500">
            ({items.length} of {limit})
          </Flex>
        )}
      </Stack>
      {items.map((_, i) => {
        return (
          <Fragment key={i}>
            <Flex h="100%" justify="flex-end" align="start">
              <IconButton
                variant="ghost"
                size="xs"
                colorScheme="red"
                icon={<FaTimes />}
                onClick={() => handleDeleteItem(i)}
              />
            </Flex>
            {itemControls?.[i]}
          </Fragment>
        );
      })}
    </>
  );
};
