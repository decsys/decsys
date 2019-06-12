import React, { useState, useEffect } from "react";
import { Grid, Cell } from "styled-css-grid";
import { FlexBox, Container } from "../../components/ui";
import { Button } from "@smooth-ui/core-sc";
import { ChevronRight } from "styled-icons/fa-solid";
import { PAGE_LOAD } from "../../utils/event-types";
import SurveyPageBody from "./Body";

// TODO: Prop Types!

const SurveyPage = ({ appBar, id, page, onNextPage, lastPage, logEvent }) => {
  const [nextEnabled, setNextEnabled] = useState(false);

  useEffect(() => {
    logEvent(page.id, PAGE_LOAD, {});
  }, [page, logEvent]);

  return (
    <Grid
      columns="1fr"
      rows="54px minmax(20px, 1fr) 80px"
      style={{ height: "100vh" }}
    >
      <Cell>{appBar}</Cell>
      <Cell style={{ overflow: "auto" }}>
        <Container>
          <SurveyPageBody
            id={id}
            components={page.components}
            setNextEnabled={setNextEnabled}
            logEvent={logEvent}
          />
        </Container>
      </Cell>
      <Cell>
        <Container>
          <FlexBox p={2} justifyContent="flex-end">
            <Button size="lg" disabled={!nextEnabled} onClick={onNextPage}>
              {lastPage ? (
                <>Finish</>
              ) : (
                <>
                  Next <ChevronRight size="1em" />
                </>
              )}
            </Button>
          </FlexBox>
        </Container>
      </Cell>
    </Grid>
  );
};

export default SurveyPage;
