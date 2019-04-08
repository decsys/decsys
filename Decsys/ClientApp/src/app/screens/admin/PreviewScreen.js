import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SurveyPage from "../../components/SurveyPage";
import { LoadingIndicator } from "../../components/ui";
import AppBar, { AppBarLink } from "../../components/AppBar";

const PurePreviewScreen = ({
  survey: { id, pages },
  surveyLoaded,
  history
}) => {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => setLastPage(page === pages.length - 1), [page]);

  const handleClick = () => {
    if (lastPage) history.push(`/admin/survey/${id}`);
    setPage(page + 1);
  };

  return surveyLoaded ? (
    <SurveyPage
      id={id}
      page={pages[page]}
      appBar={
        <AppBar brand="DECSYS - Preview" brandLink="#">
          <AppBarLink to={`/admin/survey/${id}`}>
            Back to Survey Editor
          </AppBarLink>
        </AppBar>
      }
      onNextPage={handleClick}
      logEvent={() => {}}
      lastPage={lastPage}
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
