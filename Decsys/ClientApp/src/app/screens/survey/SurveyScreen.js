import React, { useState, useEffect } from "react";
import { useNavigation } from "react-navi";
import * as api from "../../api";
import SurveyPage from "../../components/SurveyPage";
import AppBar from "../../components/AppBar";

// TODO: PropTypes
const SurveyScreen = ({
  combinedId,
  survey: { id: surveyId, pages },
  instanceId,
  participantId,
  order
}) => {
  const nav = useNavigation();
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page]);

  const sortedPages = pages
    .map(x => ({ ...x, order: order.indexOf(x.id) + 1 }))
    .sort((a, b) => a.order - b.order);

  const handleClick = () => {
    if (lastPage) return nav.navigate(`/survey/${combinedId}/complete`);
    setPage(page + 1);
  };

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
