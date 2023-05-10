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
            setResultLogged(item.isOptional && payload === null ? null : true);
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
  const [isValidResponse, setIsValidResponse] = useState(null);
  const [resultLogged, setResultLogged] = useState(false);
  const [itemKey, setItemKey] = useState(Date.now());

  const previousPageId = usePrevious(page.id);
  useLayoutEffect(() => {
    if (page.id !== previousPageId) {
      logEvent(page.id, PAGE_LOAD, {});
      // check if the page has any Response Items
      // and set Next Button appropriately
      setResultLogged(false);
      if (
        getPageResponseItem(page.components) &&
        page.components?.some((component) => component.isOptional)
      )
        setNextEnabled(true);
      else if (
        getPageResponseItem(page.components) &&
        !page.components?.some((component) => component.isOptional)
      )
        setNextEnabled(false);
      else setNextEnabled(true);
    }
  }, [previousPageId, page, logEvent]);

  useEffect(() => {
    const hasOptionalComponent = page.components?.some(
      (component) => component.isOptional
    );
    const hasMandatoryComponent = page.components?.some(
      (component) => !component.isOptional
    );

    const canProceedWithOptional =
      (hasOptionalComponent &&
        resultLogged === false &&
        isValidResponse === null) ||
      (hasOptionalComponent && resultLogged && isValidResponse);

    const canProceedWithMandatory =
      hasMandatoryComponent && resultLogged && isValidResponse === true;

    const shouldEnableNext =
      canProceedWithOptional ||
      canProceedWithMandatory ||
      !getPageResponseItem(page.components);

    setNextEnabled(shouldEnableNext);
  }, [isValidResponse, resultLogged, page.components?.length]);

  const clearResult = () => {
    const responseItemComponent = getPageResponseItem(page.components);
    setResultLogged(false);
    setIsValidResponse(null);
    logEvent(responseItemComponent?.id, COMPONENT_RESULTS, null);
    setItemKey(Date.now());
  };

  const renderContext = {
    pageId: page.id,
    surveyId,
    setIsValidResponse,
    setNextEnabled: setIsValidResponse,
    logEvent,
    clearResult,
  };

  const [isMore, setIsMore] = useState();
  const handleBodyBottomVisibilityChange = (isVisible) => setIsMore(!isVisible);

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
                key={itemKey}
                renderContext={renderContext}
                setResultLogged={setResultLogged}
                setIsValidResponse={setIsValidResponse}
                clearResult={clearResult}
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
          <Stack spacing={3} direction="row" align="center">
            <Button
              size="md"
              colorScheme="red"
              variant="outline"
              borderWidth="2px"
              onClick={clearResult}
              mr={2}
            >
              Clear Response
            </Button>
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
          </Stack>
        </DefaultContainer>
      </Flex>
    </>
  );
};

export default SurveyPage;
