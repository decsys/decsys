import { useState, useCallback, useLayoutEffect } from "react";
import { getComponent, getPageResponseItem } from "services/page-items";
import PageItemRender from "./PageItemRender";
import { PAGE_LOAD, COMPONENT_RESULTS } from "constants/event-types";
import { Stack, Button, Flex, Badge, Icon } from "@chakra-ui/react";
import DefaultContainer from "./DefaultContainer";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import VisibilitySensor from "react-visibility-sensor";
import { usePrevious } from "hooks/usePrevious";

export const Body = ({ page, renderContext }) => {
  return page.components.map((item) => {
    const renderComponent = getComponent(item.type);

    return (
      <PageItemRender
        key={item.id}
        _context={{
          ...renderContext,
          itemId: item.id,
          logResults: (payload) =>
            renderContext.logEvent(item.id, COMPONENT_RESULTS, payload),
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
}) => {
  // need to ensure this doesn't change often as an effect depends on it
  const nop = useCallback(() => () => {}, []);
  logEvent = logEvent || nop;

  const [nextEnabled, setNextEnabled] = useState(false);
  const previousPageId = usePrevious(page.id);

  useLayoutEffect(() => {
    if (page.id !== previousPageId) {
      logEvent(page.id, PAGE_LOAD, {});
      // check if the page has any Response Items
      // and set Next Button appropriately
      if (!getPageResponseItem(page.components)) setNextEnabled(true);
      else setNextEnabled(false);
    }
  }, [previousPageId, page, logEvent]);

  const renderContext = {
    pageId: page.id,
    surveyId,
    setNextEnabled,
    logEvent,
  };

  const [isMore, setIsMore] = useState();
  const handleBodyBottomVisibilityChange = (isVisible) => setIsMore(!isVisible);

  return (
    <>
      <Flex overflowY="auto" py={2}>
        <DefaultContainer>
          <Stack>
            <Body page={page} renderContext={renderContext} />
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
            disabled={!nextEnabled}
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
