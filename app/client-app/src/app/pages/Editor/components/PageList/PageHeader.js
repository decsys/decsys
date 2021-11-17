import { Flex, useColorMode, Icon, Input } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import LightHeading from "components/core/LightHeading";
import { FaGripVertical } from "react-icons/fa";
import PageActionButtons from "./PageActionButtons";
import { defaultColorMode } from "themes";

const PageHeader = ({ page, order, dragHandleProps }) => {
  const { colorMode } = useColorMode();
  const headerStyle = { light: { bg: "gray.300" }, dark: { bg: "gray.600" } };

  const [name, setName] = useState(page.name);
  const firstUpdate = useRef(true);
  useEffect(() => {
    if(firstUpdate.current==true){
      firstUpdate.current = false
      return
    }
    const delayDebounceFn = setTimeout(() => {
      console.log("this is when it would send")
      // Send Axios request here
    }, 2000)
    return () => clearTimeout(delayDebounceFn)
  }, [name])
 
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
          onChange={(value)=>setName(value.target.value)}
        />
          </Flex>
        
        </LightHeading>
      </Flex>

      <PageActionButtons {...page} />
    </Flex>
  );
};

export default PageHeader;
