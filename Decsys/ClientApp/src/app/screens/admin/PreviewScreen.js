import React, { useState, useEffect } from "react";
import { Button } from "@smooth-ui/core-sc";
import SurveyPage from "../../components/SurveyPage";
import ErrorScreen from "../ErrorScreen";
import { useNavigation, useCurrentRoute } from "react-navi";
import AppBar, { AppBarLink } from "../../components/AppBar";

const PreviewScreen = () => {
  const nav = useNavigation();
  const { id, pages } = useCurrentRoute().data.survey;
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  useEffect(() => setLastPage(page === pages.length - 1), [page, pages.length]);

  const handleClick = () => {
    if (lastPage) return nav.goBack();
    setPage(page + 1);
  };

  return pages.length ? (
    <SurveyPage
      id={id}
      page={pages[page]}
      appBar={
        <AppBar brand="DECSYS - Preview" brandLink="#">
          <AppBarLink as={Button} href="#" onClick={() => nav.goBack()}>
            Go back
          </AppBarLink>
        </AppBar>
      }
      onNextPage={handleClick}
      logEvent={() => {}}
      lastPage={lastPage}
    />
  ) : (
    <ErrorScreen
      message="This Survey has no pages!"
      callToAction={{
        label: "Go back",
        onClick: () => nav.goBack()
      }}
    />
  );
};

export default PreviewScreen;
