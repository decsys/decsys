import React, { useState, useEffect } from "react";
import { getComponent, getPageResponseItem } from "services/page-items";
import PageItemRender from "./PageItemRender";
import { PAGE_LOAD } from "constants/event-types";
import { Stack, Button, Flex } from "@chakra-ui/core";
import DefaultContainer from "./DefaultContainer";
import { FaChevronRight } from "react-icons/fa";

const Body = ({ page, renderContext }) => {
  return page.components.map((item) => {
    const renderComponent = getComponent(item.type);

    return (
      <PageItemRender
        key={item.id}
        _context={{ ...renderContext, itemId: item.id }}
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
  logEvent = () => {},
  logResults = () => {},
}) => {
  // TODO: get log Actions from context?

  const [nextEnabled, setNextEnabled] = useState(false);

  useEffect(() => {
    logEvent(page.id, PAGE_LOAD, {});
    // check if the page has any Response Items
    // and set Next Button appropriately
    if (!getPageResponseItem(page.components)) setNextEnabled(true);
  }, [page, logEvent]);

  const renderContext = {
    pageId: page.id,
    surveyId,
    setNextEnabled,
    logEvent,
    logResults,
  };

  return (
    <>
      <DefaultContainer>
        <Stack>
          <Body page={page} renderContext={renderContext} />
        </Stack>
      </DefaultContainer>

      <DefaultContainer>
        <Flex justify="flex-end">
          <Button
            size="lg"
            disabled={!nextEnabled}
            colorScheme={nextEnabled ? "blue" : "gray"}
            onClick={handleNextClick}
            rightIcon={!lastPage && <FaChevronRight />}
          >
            {lastPage ? "Finish" : "Next"}
          </Button>
        </Flex>
      </DefaultContainer>
    </>
  );
};

export default SurveyPage;
