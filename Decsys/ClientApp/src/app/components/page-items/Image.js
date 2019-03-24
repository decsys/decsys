import React from "react";
import paramTypes, { setParams } from "../../../param-types";
import { FlexBox } from "../ui";

const PageImage = ({ surveyId, id, extension }) =>
  // TODO: this probably shouldn't be hard coded,
  // but it also doesn't need implementation exposing elsewhere
  // this is clean, but we should probably move the path to a config or something

  // TODO: in future we could support remote urls too
  // but for now just local uploaded images

  // atm we do nothing if the param isn't set
  (extension && (
    <FlexBox width={1} justifyContent="center">
      <img
        alt={`SurveyPageComponent_${surveyId}_${id}`}
        src={`/surveys/images/${surveyId}/${id}${extension}?${new Date().getTime()}`}
      />
    </FlexBox>
  )) ||
  null;

setParams(PageImage, {
  extension: paramTypes.stringUndefined("Image File Extension"),
  surveyId: paramTypes.number("Survey ID"),
  id: paramTypes.stringUndefined("Image Component ID")
});

export default PageImage;
