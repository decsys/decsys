import React, { useState } from "react";
import { Grid, Cell } from "styled-css-grid";
import AppBar from "../../components/AppBar";
import { FlexBox, Container } from "../../components/ui";
import { Button } from "@smooth-ui/core-sc";
import { ChevronRight } from "styled-icons/fa-solid";
import ComponentRender from "../../components/ComponentRender";
import { getComponent } from "../../utils/component-utils";
import Link from "../../components/AppBar/Link";

const PureSurveyScreen = ({ id, page, preview, onClick, pageCount, nPage }) => {
  const [nextEnabled, setNextEnabled] = useState(true);

  return (
    <Grid columns="1fr" style={{ height: "100vh" }}>
      <Cell>
        {preview ? (
          <AppBar brand="DECSYS - Preview" brandLink="#">
            <Link href={`/admin/survey/${id}`}>Back to Survey Editor</Link>
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
                actions={{ setNextEnabled }}
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
