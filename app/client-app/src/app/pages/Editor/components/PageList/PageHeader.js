import { Flex, useColorMode, Icon, Input } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import LightHeading from "components/core/LightHeading";
import { FaGripVertical } from "react-icons/fa";
import PageActionButtons from "./PageActionButtons";
import { defaultColorMode } from "themes";
import axios from "axios";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { authorization_BearerToken, withHeaders, contentType_AppJson } from "api/helpers";
import { useDerivedState } from "hooks/useDerivedState";
import useDeferredAction from "hooks/useDeferredAction";
const PageHeader = ({ page, order, dragHandleProps }) => {
  const { colorMode } = useColorMode();
  const headerStyle = { light: { bg: "gray.300" }, dark: { bg: "gray.600" } };
  const { id, mutate } = useFetchSurvey();
  //const [name, setName] = useState(page.name);
  const [name, setName] = useDerivedState(page.name);
  //const { saveName } = useSurveyCardActions();
  // just need to make a save name function in an api file
  const handleNameSave = async (value) =>{
    //saveName(id, value, setNameState);
    axios.put(
      `/api/surveys/${id}/pages/${page.id}/name`,
      JSON.stringify(value),
      withHeaders(contentType_AppJson, await authorization_BearerToken())
    )
  }
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
