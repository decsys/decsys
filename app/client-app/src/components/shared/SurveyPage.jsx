import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { getComponent, getPageResponseItem } from "services/page-items";
import PageItemRender from "./PageItemRender";
import { PAGE_LOAD, COMPONENT_RESULTS } from "constants/event-types";
import { Stack, Button, Flex, Badge, Icon, Box, Text } from "@chakra-ui/react";
import DefaultContainer from "./DefaultContainer";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { InView } from "react-intersection-observer";
import { usePrevious } from "hooks/usePrevious";
import { BusyPage } from "components/core";
import { FaRegBell, FaBell } from "react-icons/fa";

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
            setResultLogged(
              item.isOptional && Object.keys(payload).length == 0 ? null : true
            );
          },
        }}
        component={renderComponent}
        params={item.params}
      />
    );
  });
};

const WebhookCounter = ({ webhookCount, unread }) => (
  <Stack direction="row" align="center" spacing={1}>
    <Button
      size="lg"
      colorScheme="teal"
      variant="outline"
      borderWidth="2px"
      mr={2}
    >
      <Flex align="center" position="relative">
        <Icon as={webhookCount > 0 ? FaBell : FaRegBell} boxSize="24px" />
        {unread && (
          <Box
            position="absolute"
            top="-6px"
            right="-3px"
            backgroundColor="red"
            borderRadius="50%"
            width="18px"
            height="17px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" color="white">
              {webhookCount}
            </Text>
          </Box>
        )}
      </Flex>
    </Button>
  </Stack>
);

const SurveyPage = ({
  surveyId,
  page,
  lastPage,
  handleNextClick,
  logEvent,
  isBusy,
  webhookCount,
  unread,
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
      setIsValidResponse(null);
      const hasResponseItem = !!getPageResponseItem(page.components);
      let hasOptionalItems;
      if (hasResponseItem)
        hasOptionalItems = page.components?.some(
          (component) => component.isOptional
        );

      if (hasResponseItem && hasOptionalItems) setNextEnabled(true);
      else if (hasResponseItem && !hasOptionalItems) setNextEnabled(false);
      else setNextEnabled(true);
    }
  }, [previousPageId, page, logEvent]);

  useEffect(() => {
    const hasOptionalComponent = page.components?.some(
      (component) => component.isOptional
    );
    const hasMandatoryComponent = !hasOptionalComponent;

    const canProceedWithOptional =
      (hasOptionalComponent &&
        resultLogged === false &&
        isValidResponse == null) ||
      (hasOptionalComponent && resultLogged && isValidResponse);

    const canProceedWithMandatory =
      hasMandatoryComponent && resultLogged && isValidResponse;

    const shouldEnableNext =
      canProceedWithOptional ||
      canProceedWithMandatory ||
      !getPageResponseItem(page.components);

    setNextEnabled(shouldEnableNext);
  }, [isValidResponse, resultLogged, page.components]);

  const clearResult = () => {
    const responseItemComponent = getPageResponseItem(page.components);
    setResultLogged(false);
    setIsValidResponse(null);
    logEvent(responseItemComponent?.id, COMPONENT_RESULTS, {});
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
              <BusyPage />
            ) : (
              <Body
                page={page}
                key={itemKey}
                renderContext={renderContext}
                setResultLogged={setResultLogged}
                setIsValidResponse={setIsValidResponse}
              />
            )}
            <InView onChange={handleBodyBottomVisibilityChange}>
              <div style={{ height: "1px" }} />
            </InView>
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
              size="lg"
              colorScheme="red"
              variant="outline"
              borderWidth="2px"
              onClick={clearResult}
              mr={2}
            >
              Clear Response
            </Button>
            {webhookCount != null && (
              <WebhookCounter webhookCount={webhookCount} unread={unread} />
            )}
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
