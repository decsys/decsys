import React, { useState, useEffect } from "react";
import { Grid, Cell } from "styled-css-grid";
import AppBar from "../../components/AppBar";
import { FlexBox, Container } from "../../components/ui";
import { Button } from "@smooth-ui/core-sc";
import { ChevronRight } from "styled-icons/fa-solid";
import ComponentRender from "../../components/ComponentRender";
import { getComponent } from "../../utils/component-utils";
import Link from "../../components/AppBar/Link";
import { COMPONENT_RESULTS, PAGE_LOAD } from "../../utils/event-types";

// TODO: Prop Types!

const PureSurveyScreen = ({
  id,
  page,
  preview,
  onClick,
  pageCount,
  nPage,
  logEvent
}) => {
  const [nextEnabled, setNextEnabled] = useState(true);

  useEffect(() => {
    logEvent(page.id, PAGE_LOAD, {});
  }, []);

  return (
    <Grid
      columns="1fr"
      rows="54px minmax(20px, 1fr) 80px"
      style={{ height: "100vh" }}
    >
      <Cell>
        {preview ? (
          <AppBar brand="DECSYS - Preview" brandLink="#">
            <Link to={`/admin/survey/${id}`}>Back to Survey Editor</Link>
          </AppBar>
        ) : (
          <AppBar brand="DECSYS" />
        )}
      </Cell>
      <Cell style={{ overflow: "auto" }}>
        <Container>
          <FlexBox p={1} flexDirection="column">
            {page.components.map(x => (
              <ComponentRender
                key={x.id}
                component={getComponent(x.type)}
                actions={{
                  setNextEnabled,
                  logEvent: (type, payload) => logEvent(x.id, type, payload),
                  logResults: payload =>
                    logEvent(x.id, COMPONENT_RESULTS, payload)
                }}
                params={
                  x.type === "image"
                    ? {
                        ...x.params,
                        surveyId: id,
                        id: x.id
                      }
                    : x.params
                }
              />
            ))}
          </FlexBox>
        </Container>
      </Cell>
      <Cell>
        <Container>
          <FlexBox p={2} justifyContent="flex-end">
            <Button size="lg" disabled={!nextEnabled} onClick={onClick}>
              {nPage === pageCount - 1 ? (
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

export { PureSurveyScreen };

//export default SurveyScreen;
