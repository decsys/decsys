import { Flex, useColorMode, Icon, Input } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaGripVertical } from "react-icons/fa";
import PageActionButtons from "./PageActionButtons";
import { defaultColorMode } from "themes";
import { useDerivedState } from "hooks/useDerivedState";
import useDeferredAction from "hooks/useDeferredAction";
import { usePageListContext } from "../../contexts/PageList";

const PageHeader = ({ page, order, dragHandleProps }) => {
  const { colorMode } = useColorMode();
  const headerStyle = { light: { bg: "gray.300" }, dark: { bg: "gray.600" } };
  const { setPageName } = usePageListContext();
  const [name, setName] = useDerivedState(page.name);

  const handleNameSave = async (value) => {
    setPageName(page.id, value);
  };
  const deferredSave = useDeferredAction(handleNameSave);
  const handleChange = ({ target: { value } }) => {
    setName(value);
    deferredSave(value);
  };

  return (
    <Flex
      borderTopRadius={5}
      align="center"
      justify="space-between"
      {...headerStyle[colorMode || defaultColorMode]}
      role="group"
    >
      <Flex {...dragHandleProps} p={2} align="center" width="100%">
        <Flex width="1.5em" justify="center">
          <Icon as={FaGripVertical} />
        </Flex>
        <LightHeading mx={2} size="sm">
          <Flex align="center">
            {order}
            <Input
              variant="flushed"
              borderRadius={0}
              fontSize="1.3rem"
              value={name}
              ml={2}
              onChange={handleChange}
            />
          </Flex>
        </LightHeading>
      </Flex>

      <PageActionButtons {...page} />
    </Flex>
  );
};

export default PageHeader;
