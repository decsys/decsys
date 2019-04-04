import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SurveyPage from "../../components/SurveyPage";
import { LoadingIndicator } from "../../components/ui";
import AppBar from "../../components/AppBar";

const PureSurveyScreen = ({ id, survey, surveyLoaded, history, logEvent }) => {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => setLastPage(page === survey.pages.length - 1), [page]);

  const handleClick = () => {
    if (lastPage) history.push(`/survey/complete`);
    setPage(page + 1);
  };

  return surveyLoaded ? (
    <SurveyPage
      id={id}
      page={survey.pages[page]}
      appBar={<AppBar brand="DECSYS" brandLink="#" />}
      onClick={handleClick}
      logEvent={logEvent}
      lastPage={lastPage}
    />
  ) : (
    <LoadingIndicator />
  );
};

const SurveyScreen = withRouter(
  connect(({ user, survey: { instanceId, survey, surveyLoaded } }) => ({
    survey,
    surveyLoaded
  }))(PureSurveyScreen)
);

export { PureSurveyScreen };

export default SurveyScreen;

// const SurveyScreen = connect(
//     ({ user, survey: { id, pages, currentPage, instanceId } }) => ({
//       id,
//       page: pages[currentPage],
//       lastPage: currentPage === pages.length - 1,
//       instanceId,
//       userId: user.id
//     }),
//     dispatch => ({
//       onNextPage: () => dispatch({ type: "NEXT_CLICK" }),
//       logEvent: (instanceId, participantId, source, type, payload) =>
//         dispatch({ type: "LOG_EVENT" })
//     }),
//     (stateProps, dispatchProps, ownProps) => ({
//       ...ownProps,
//       ...stateProps,
//       ...dispatchProps,
//       logEvent: (source, type, payload) =>
//         dispatchProps.logEvent(
//           stateProps.instanceId,
//           stateProps.userId,
//           source,
//           type,
//           payload
//         )
//     })
//   )(PureSurveyScreen);
