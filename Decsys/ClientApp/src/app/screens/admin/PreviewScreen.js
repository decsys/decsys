import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { PureSurveyScreen } from "../survey/SurveyScreen";
import { LoadingIndicator } from "../../components/ui";

const PurePreviewScreen = ({ id, survey, surveyLoaded, history }) => {
  const [page, setPage] = useState(0);

  const handleClick = () => {
    if (page === survey.pages.length - 1) history.push(`/admin/survey/${id}`);
    setPage(page + 1);
  };

  return surveyLoaded ? (
    <PureSurveyScreen
      id={id}
      nPage={page}
      page={survey.pages[page]}
      preview
      onClick={handleClick}
      pageCount={survey.pages.length}
    />
  ) : (
    <LoadingIndicator />
  );
};

const PreviewScreen = withRouter(
  connect(({ editor: { survey, surveyLoaded } }) => ({
    survey,
    surveyLoaded
  }))(PurePreviewScreen)
);

export { PurePreviewScreen };

export default PreviewScreen;
