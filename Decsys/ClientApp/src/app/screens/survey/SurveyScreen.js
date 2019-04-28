import React, { useState, useEffect } from "react";
import { useNavigation } from "react-navi";
import * as api from "../../api";
import SurveyPage from "../../components/SurveyPage";
import AppBar from "../../components/AppBar";
import { SURVEY_COMPLETE } from "../../utils/event-types";

// TODO: PropTypes
const SurveyScreen = ({
  combinedId,
  survey: { id: surveyId, pages },
  instanceId,
  participantId,
  order,
  currentPage
}) => {
  const logEvent = async (source, type, payload) => {
    // TODO: Promise?
    await api.logParticipantEvent(
      instanceId,
      participantId,
      source,
      type,
      payload
    );
  };

  const nav = useNavigation();

  const sortedPages = pages
    .map(x => ({ ...x, order: order.indexOf(x.id) + 1 }))
    .sort((a, b) => a.order - b.order);

  /**
   * currentPage is set by the routing at the moment as follows:
   * new userId : null
   * existing userId, incomplete Survey : resume last loaded
   * existing userId, complete Survey, repeatable : null
   * existing userId, complete Survey, one time : pages.length
   */
  let initialPage;
  if (currentPage == null) initialPage = 0;
  else initialPage = sortedPages.indexOf(currentPage);

  const [page, setPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => {
    // check if we are beyond lastPage
    // (e.g. resuming an already completed one time survey)
    if (page >= pages.length) {
      logEvent(surveyId, SURVEY_COMPLETE, {});
      nav.navigate(`/survey/${combinedId}/complete`);
      return;
    }

    // if no reason to navigate to the completion page,
    // then do an ordinary lastPage check
    setLastPage(page >= pages.length - 1);
  }, [page]);

  const handleClick = () => {
    // TODO confirm modal? if (lastPage)
    setPage(page + 1);
  };

  return (
    <>
      <SurveyPage
        id={surveyId}
        page={sortedPages[page]}
        appBar={<AppBar brand="DECSYS" brandLink="#" />}
        onNextPage={handleClick}
        logEvent={logEvent}
        lastPage={lastPage}
      />
    </>
  );
};

export default SurveyScreen;
