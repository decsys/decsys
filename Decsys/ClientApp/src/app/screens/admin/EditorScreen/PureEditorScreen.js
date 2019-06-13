import React from "react";
import PropTypes from "prop-types";
import EditorBar from "../../../components/EditorBar";
import { Grid, Cell } from "styled-css-grid";
import EditorPageList from "../../../components/EditorPageList";
import { EmptyState } from "../../../components/ui";
import { FileAlt } from "styled-icons/fa-solid";
import { Box, colorVariant } from "@smooth-ui/core-sc";
import ComponentRender from "../../../components/ComponentRender";
import ComponentEditor from "../../../components/ComponentEditor";
import ParagraphPreview from "../../../components/ComponentEditor/ParagraphPreview";
import ImageUpload from "../../../components/ComponentEditor/ImageUpload";
import { getComponent } from "../../../utils/component-utils";

const PureEditorScreen = ({
  survey,
  components,
  onParamChange,
  onImageAddClick,
  onImageRemoveClick,
  pageListActions,
  component
}) => {
  // Configure the base Editor Bar so we don't pass props multiple times
  const SurveyEditorBar = ({ disabled }) => (
    <EditorBar id={survey.id} name={survey.name || ""} disabled={disabled} />
  );

  const CurrentComponent = component
    ? getComponent(component.component.type)
    : null;

  return (
    <Grid
      columns="1fr 2fr"
      rows="auto minmax(200px, 2fr) minmax(200px, 1fr)"
      rowGap="0px"
      height="100%"
      columnGap="0px"
      style={{ height: "100vh" }}
    >
      <Cell width={2}>
        <SurveyEditorBar />
      </Cell>
      <Cell
        height={2}
        style={{
          overflow: "auto",
          backgroundColor: colorVariant("gray500")({})
        }}
      >
        <EditorPageList
          pages={survey.pages}
          components={components}
          component={component}
          actions={pageListActions}
        />
      </Cell>

      {(component && (
        <>
          <Cell style={{ padding: "1em", overflow: "auto" }}>
            {component.component.type === "paragraph" ? (
              <ParagraphPreview
                component={CurrentComponent}
                params={component.component.params}
                onChange={e =>
                  onParamChange(
                    component.pageId,
                    component.component.id,
                    "text",
                    e.target.value
                  )
                }
              />
            ) : (
              <ComponentRender
                key={component.component.id}
                component={CurrentComponent}
                params={
                  component.component.type === "image"
                    ? {
                        ...component.component.params,
                        surveyId: survey.id,
                        id: component.component.id
                      }
                    : component.component.params
                }
              />
            )}
          </Cell>
          <Cell
            style={{
              padding: "1em",
              overflow: "auto",
              backgroundColor: colorVariant("gray300")({})
            }}
          >
            {component.component.type === "image" ? (
              <ImageUpload
                params={component.component.params}
                onAddClick={(file, extension) =>
                  onImageAddClick(
                    component.pageId,
                    component.component.id,
                    file,
                    extension
                  )
                }
                onRemoveClick={() =>
                  onImageRemoveClick(component.pageId, component.component.id)
                }
              />
            ) : (
              <ComponentEditor
                onChange={(paramKey, value) =>
                  onParamChange(
                    component.pageId,
                    component.component.id,
                    paramKey,
                    value
                  )
                }
                component={CurrentComponent}
                params={component.component.params}
              />
            )}
          </Cell>
        </>
      )) || (
        <Cell height={2}>
          <Box mt={2}>
            <EmptyState
              message={
                !survey.pages.length
                  ? "Get your Survey started with a new Page"
                  : "Select a Page Item to edit"
              }
              splash={!survey.pages.length ? <FileAlt /> : undefined}
              callToAction={
                (!survey.pages.length && {
                  label: "Add a Page",
                  onClick: pageListActions.onAddClick
                }) ||
                undefined
              }
            />
          </Box>
        </Cell>
      )}
    </Grid>
  );
};

PureEditorScreen.propTypes = {
  survey: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  pageListActions: EditorPageList.propTypes.actions
};

export default PureEditorScreen;
