import React, { useState, useEffect } from "react";
import { Page } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { useSurvey } from "api/surveys";
import { navigate } from "@reach/router";
import { decode } from "services/instance-id";

const Survey = ({ id }) => {
  const [surveyId, instanceId] = decode(id);
  const {
    data: { pages },
  } = useSurvey(surveyId);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);

  const handleClick = () => {
    if (lastPage) return navigate(-1);
    setPage(page + 1);
  };

  return (
    <Page layout="survey">
      <SurveyPage
        surveyId={surveyId}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
      />
    </Page>
  );
};

export default Survey;
