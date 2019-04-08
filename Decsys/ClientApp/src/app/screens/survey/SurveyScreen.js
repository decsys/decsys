import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SurveyPage from "../../components/SurveyPage";
import { LoadingIndicator, EmptyState } from "../../components/ui";
import AppBar from "../../components/AppBar";
import Axios from "axios";
import { ExclamationTriangle } from "styled-icons/fa-solid";
import useSurveyInstance from "./useSurveyInstance";

// TODO: PropTypes
const PureSurveyScreen = ({ instanceId, page = 1, history }) => {
  const survey = useSurveyInstance(instanceId);
  const lastPage = page === survey.pages.length;

  const handleClick = () => {
    if (lastPage) history.push(`/survey/${instanceId}/complete`);
    else history.push(`/survey/${instanceId}/page/${++page}`);
  };

  const logEvent = async (source, type, payload) => {
    await Axios.post(
      //`/api/log/${instanceId}/${user.id}/${source}/${type}`,
      payload
    );
    // TODO: error handling?
  };

  // ----
  // Render
  // ----
  if (!survey) return <LoadingIndicator />;

  if (survey.invalid)
    return (
      <EmptyState
        splash={<ExclamationTriangle />}
        message="We couldn't find that survey. If it exists, it may have been closed."
      />
    );

  return (
    <>
      <SurveyPage
        id={survey.surveyId}
        page={survey.pages[page]}
        appBar={<AppBar brand="DECSYS" brandLink="#" />}
        onClick={handleClick}
        logEvent={logEvent}
        lastPage={lastPage}
      />
    </>
  );
};

export { PureSurveyScreen };
export default withRouter(PureSurveyScreen);

// const SurveyScreen = withRouter(
//   connect(
//     ({
//       user: { id: userId, surveyState },
//       survey: {
//         instance: { id: instanceId, closed },
//         survey,
//         surveyLoaded
//       }
//     }) => ({
//       survey,
//       surveyLoaded,
//       surveyState,
//       userId,
//       instanceId,
//       closed
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
//   )(PureSurveyScreen)
// );

// export { PureSurveyScreen };

// export default SurveyScreen;
