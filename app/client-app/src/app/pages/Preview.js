import { useState, useEffect } from "react";
import { Page } from "components/core";
import SurveyPage from "components/shared/SurveyPage";
import { useSurvey } from "api/surveys";
import { navigate } from "@reach/router";

const Preview = ({ id }) => {
  const {
    data: { pages },
  } = useSurvey(id);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);

  const handleClick = () => {
    if (lastPage) return navigate(-1); // TODO: Optional Completion Redirect URL
    setPage(page + 1);
  };

  return (
    <Page layout="preview">
      <SurveyPage
        surveyId={id}
        page={pages[page]}
        lastPage={lastPage}
        handleNextClick={handleClick}
      />
    </Page>
  );
};

export default Preview;
