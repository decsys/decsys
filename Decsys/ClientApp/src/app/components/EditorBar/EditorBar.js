import React from "react";
import { Eye, Copy, FileExport, Trash } from "styled-icons/fa-solid";
import { Grid } from "styled-css-grid";
import EditorBarButton from "./Button";
import NameInput from "./NameInput";

const EditorBar = ({
  disabled,
  onPreviewClick,
  onDuplicateClick,
  onExportClick,
  onDeleteClick
}) => (
  <Grid columnGap="0px" columns="1fr auto auto auto auto">
    <NameInput disabled={disabled} />
    <EditorBarButton onClick={onPreviewClick} disabled={disabled}>
      <Eye size="1em" /> Preview
    </EditorBarButton>
    <EditorBarButton onClick={onDuplicateClick} disabled={disabled}>
      <Copy size="1em" /> Duplicate
    </EditorBarButton>
    <EditorBarButton onClick={onExportClick} disabled={disabled}>
      <FileExport size="1em" /> Export
    </EditorBarButton>
    <EditorBarButton
      variant="danger"
      onClick={onDeleteClick}
      disabled={disabled}
    >
      <Trash size="1em" /> Delete
    </EditorBarButton>
  </Grid>
);

export default EditorBar;
