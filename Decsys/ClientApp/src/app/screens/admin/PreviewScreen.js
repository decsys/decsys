import React, { useState } from "react";
import { PureSurveyScreen } from "../survey/SurveyScreen";
import { useNavigation, useCurrentRoute } from "react-navi";

const PreviewScreen = () => {
  const { survey } = useCurrentRoute().data;

  const [page, setPage] = useState(0);
  const navigation = useNavigation();

  const handleClick = () => {
    if (page === survey.pages.length - 1)
      return navigation.navigate(`/admin/survey/${survey.id}`);
    setPage(page + 1);
  };

  return (
    <PureSurveyScreen
      id={survey.id}
      nPage={page}
      page={survey.pages[page]}
      preview
      onClick={handleClick}
      pageCount={survey.pages.length}
    />
  );
};

export default PreviewScreen;
