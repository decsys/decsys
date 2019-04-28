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
  progressStatus
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

  // we set an initialPage value
  // based on progressStatus provided to us
  // about the current Participant ID
  let initialPage;
  if (progressStatus.completed && progressStatus.oneTimeParticipants)
    initialPage = pages.length;
  if (progressStatus.inProgress)
    initialPage = sortedPages.findIndex(
      x => x.id == progressStatus.lastPageLoaded
    );
  else initialPage = 0;

  const [page, setPage] = useState(initialPage < 0 ? 0 : initialPage);
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

  return sortedPages[page] ? (
    <SurveyPage
      id={surveyId}
      page={sortedPages[page]}
      appBar={<AppBar brand="DECSYS" brandLink="#" />}
      onNextPage={handleClick}
      logEvent={logEvent}
      lastPage={lastPage}
    />
  ) : null;
};

export default SurveyScreen;
