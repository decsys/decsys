import React from "react";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import { FlexBox } from "components/core";
import { Box } from "@smooth-ui/core-sc";
import {
  propTypes as contextProps,
  defaultProps as contextDefaults
} from "constants/param-types";

const PageImage = ({ _context: { surveyId, itemId }, extension }) => {
  // TODO: the path probably shouldn't be hard coded,
  // but it also doesn't need implementation exposing elsewhere
  // this is clean, but we should probably move the path to a config or something

  // TODO: in future we could support remote urls too
  // but for now just local uploaded images

  // atm we do nothing if the param isn't set
  const src = `/surveys/images/${surveyId}/${itemId}${extension}?${new Date().getTime()}`;
  return extension ? (
    <FlexBox width={1} justifyContent="center">
      <Box width="70%" textAlign="center">
        <img
          style={{ maxWidth: "100%" }}
          alt={`SurveyPageComponent_${surveyId}_${itemId}`}
          src={src}
        />
      </Box>
    </FlexBox>
  ) : null;
};

PageImage.params = {
  extension: ParamTypes.stringUndefined("Image File Extension")
};

const { pt, defaultProps } = buildPropTypes(
  PageImage.params,
  contextProps,
  contextDefaults
);
PageImage.propTypes = pt;
PageImage.defaultProps = defaultProps;

export default PageImage;
