import { useState } from "react";
import { useCombobox } from "downshift";
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

const ChevronDown = (p) => (
  <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...p}>
    <path
      fill="currentColor"
      d="M6.343 7.757L4.93 9.172 12 16.242l7.071-7.07-1.414-1.415L12 13.414 6.343 7.757z"
    />
  </svg>
);

const DropDownList = ({
  onSelection,
  options,
  width = "70%",
  textColor = "black",
  fontSize = "1em",
  fontFamily = "Arial",
}) => {
  const [inputItems, setInputItems] = useState(options);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox({
    items: inputItems,
    itemToString: (option) => option.label,
    onSelectedItemChange: ({ selectedItem }) => {
      onSelection(JSON.stringify(selectedItem));
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        options.filter((option) =>
          option.label.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <Flex w={width} {...getComboboxProps()}>
      <InputGroup>
        <Input
          color={textColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
          cursor="default"
          {...getInputProps({
            onClick: () => {
              if (!isOpen) {
                openMenu();
                setInputItems(options);
              }
            },
          })}
        />
        <InputRightElement pointerEvents="none">
          <Flex boxSize="24px" align="center">
            <ChevronDown />
          </Flex>
        </InputRightElement>
      </InputGroup>

      <List
        {...getMenuProps()}
        position="absolute"
        top="60px"
        w={width}
        shadow="md"
        backgroundColor="white"
        borderColor="gray.200"
        borderWidth={1}
        borderRadius={3}
        zIndex="dropdown"
        py={2}
        maxHeight="300px"
        overflowY="auto"
        hidden={!isOpen}
      >
        {inputItems.map((item, index) => (
          <ListItem
            key={item.value}
            p={2}
            bg={highlightedIndex === index ? "blue.400" : undefined}
            color={highlightedIndex === index ? "gray.100" : textColor}
            fontSize={fontSize}
            fontFamily={fontFamily}
            cursor="default"
            {...getItemProps({ item, index })}
          >
            <Text>{item.label}</Text>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};

export default DropDownList;
