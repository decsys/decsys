import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { getComponent, getPageResponseItem } from "services/page-items";
import PageItemRender from "./PageItemRender";
import { PAGE_LOAD, COMPONENT_RESULTS } from "constants/event-types";
import { Stack, Button, Flex, Badge, Icon, Tooltip } from "@chakra-ui/react";
import DefaultContainer from "./DefaultContainer";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { InView } from "react-intersection-observer";
import { usePrevious } from "hooks/usePrevious";
import { BusyPage } from "components/core";
import { WebhookNotification } from "app/pages/Preview/components/Webhook/WebhookNotification";
import { useServerConfig } from "api/config";

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

const SurveyPage = ({
  surveyId,
  page,
  lastPage,
  handleNextClick,
  logEvent,
  isBusy,
  webhookCount,
  unread,
  setUnread,
  setWebhookCount,
  triggeredHooks,
}) => {
  // Feature Flag

  // need to ensure this doesn't change often as an effect depends on it
  const nop = useCallback(() => () => {}, []);
  logEvent = logEvent || nop;

  const [nextEnabled, setNextEnabled] = useState(false);
  const [isValidResponse, setIsValidResponse] = useState(null);
  const [resultLogged, setResultLogged] = useState(false);
  const [itemKey, setItemKey] = useState(Date.now());

  const previousPageId = usePrevious(page.id);

  const hasOptionalComponent = page.components?.some(
    (component) => component.isOptional
  );

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
          <Stack
            direction={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems="center"
            w="100%"
          >
            <div>
              {isMore && (
                <Badge>
                  Scroll down for more <Icon as={FaChevronDown} />
                </Badge>
              )}
            </div>
            <Stack spacing={3} direction="row" align="center">
              <Tooltip
                label="This page requires a response before proceeding, so it cannot be cleared. You can continue to change your response before submitting."
                isDisabled={hasOptionalComponent}
                shouldWrapChildren
              >
                <Button
                  size="lg"
                  colorScheme="red"
                  variant="outline"
                  borderWidth="2px"
                  onClick={clearResult}
                  mr={2}
                  isDisabled={!hasOptionalComponent}
                >
                  Clear Response
                </Button>
              </Tooltip>
              <Tooltip label="Triggered Webhook" shouldWrapChildren>
                {webhookCount != null && (
                  <WebhookNotification
                    webhookCount={webhookCount}
                    unread={unread}
                    setUnread={setUnread}
                    setWebhookCount={setWebhookCount}
                    triggeredHooks={triggeredHooks}
                  />
                )}
              </Tooltip>
              <Tooltip
                label={
                  nextEnabled
                    ? lastPage
                      ? "End the Survey"
                      : "Go to the next page"
                    : "A response is required to proceed!"
                }
                shouldWrapChildren
              >
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
              </Tooltip>
            </Stack>
          </Stack>
        </DefaultContainer>
      </Flex>
    </>
  );
};

export default SurveyPage;
