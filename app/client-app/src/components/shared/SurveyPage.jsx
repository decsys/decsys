import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { getComponent, getPageResponseItem } from "services/page-items";
import PageItemRender from "./PageItemRender";
import { PAGE_LOAD, COMPONENT_RESULTS } from "constants/event-types";
import { Stack, Button, Flex, Badge, Icon } from "@chakra-ui/react";
import DefaultContainer from "./DefaultContainer";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import VisibilitySensor from "react-visibility-sensor";
import { usePrevious } from "hooks/usePrevious";
import { LoadingIndicator } from "components/core";

export const Body = ({ page, renderContext, setResultLogged }) => {
  return page.components.map((item) => {
    const renderComponent = getComponent(item.type);

    return (
      <PageItemRender
        key={item.id}
        _context={{
          ...renderContext,
          itemId: item.id,
          logResults: (payload) => {
            renderContext.logEvent(item.id, COMPONENT_RESULTS, payload);
            setResultLogged(true);
          },
        }}
        component={renderComponent}
        params={item.params}
      />
    );
  });
};

const SurveyPage = ({
  surveyId,
  page,
  lastPage,
  handleNextClick,
  logEvent,
  isBusy,
}) => {
  // need to ensure this doesn't change often as an effect depends on it
  const nop = useCallback(() => () => {}, []);
  logEvent = logEvent || nop;

  const [nextEnabled, setNextEnabled] = useState(false);
  const [isValidResponse, setIsValidResponse] = useState(false);
  const [resultLogged, setResultLogged] = useState(false);

  const previousPageId = usePrevious(page.id);
  useLayoutEffect(() => {
    if (page.id !== previousPageId) {
      logEvent(page.id, PAGE_LOAD, {});
      // check if the page has any Response Items
      // and set Next Button appropriately
      if (
        getPageResponseItem(page.components) &&
        page.components[0].isOptional === true
      )
        setNextEnabled(true);
      else if (
        getPageResponseItem(page.components) &&
        page.components[0].isOptional === false
      )
        setNextEnabled(false);
      else setNextEnabled(true);
    }
  }, [previousPageId, page, logEvent]);

  useEffect(() => {
    const optionalComponent = page.components[0]?.isOptional;
    const shouldEnableNext =
      optionalComponent || (isValidResponse && resultLogged);
    if (!optionalComponent && shouldEnableNext) {
      setNextEnabled(true);
    }
  }, [isValidResponse, resultLogged]);

  const renderContext = {
    pageId: page.id,
    surveyId,
    setIsValidResponse,
    setNextEnabled: setIsValidResponse,
    logEvent,
  };

  const [isMore, setIsMore] = useState();
  const handleBodyBottomVisibilityChange = (isVisible) => setIsMore(!isVisible);
  console.log(nextEnabled);

  return (
    <>
      <Flex overflowY="auto" py={2}>
        <DefaultContainer>
          <Stack>
            {isBusy ? (
              <LoadingIndicator />
            ) : (
              <Body
                page={page}
                renderContext={renderContext}
                setResultLogged={setResultLogged}
                setIsValidResponse={setIsValidResponse}
              />
            )}
            <VisibilitySensor onChange={handleBodyBottomVisibilityChange}>
              <div style={{ height: "1px" }} />
            </VisibilitySensor>
          </Stack>
        </DefaultContainer>
      </Flex>

      <Flex
        w="100%"
        zIndex={1}
        boxShadow={
          isMore
            ? "0 -10px 10px -5px rgba(50,100,200,.5), 0 -1px 3px -5px rgba(50,100,200,.8)"
            : "none"
        }
      >
        <DefaultContainer
          display="flex"
          w="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <div>
            {isMore && (
              <Badge>
                Scroll down for more <Icon as={FaChevronDown} />
              </Badge>
            )}
          </div>
          <Button
            size="lg"
            disabled={!nextEnabled || isBusy}
            isLoading={isBusy}
            colorScheme={nextEnabled ? "blue" : "gray"}
            onClick={handleNextClick}
            rightIcon={!lastPage && <FaChevronRight />}
          >
            {lastPage ? "Finish" : "Next"}
          </Button>
        </DefaultContainer>
      </Flex>
    </>
  );
};

export default SurveyPage;
