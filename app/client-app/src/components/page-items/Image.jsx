import ParamTypes from "@decsys/param-types";
import { Image, Flex } from "@chakra-ui/react";
import ImageParamsEditor from "./Image.ParamsEditor";

const PageImage = ({ _context: { surveyId, itemId }, extension, width }) => {
  // atm we do nothing if the param isn't set
  if (!extension) return null;

  // TODO: in future we could support remote urls too
  // but for now just local uploaded images

  // TODO: the path probably shouldn't be hard coded,
  // but it also doesn't need implementation exposing elsewhere
  // this is clean, but we should probably move the path to a config or something
  const src = `/surveys/images/${surveyId}/${itemId}${extension}?${new Date().getTime()}`;
  return (
    <Flex w="100%" justify="center">
      <Image
        w={width}
        src={src}
        alt={`SurveyPageComponent_${surveyId}_${itemId}`}
        ignoreFallback
      />
    </Flex>
  );
};

PageImage.params = {
  extension: ParamTypes.stringUndefined("Image File Extension"),
  width: ParamTypes.stringUndefined("Image Width"),
  questionContent: ParamTypes.string("Question Content"),
  originalFilename: ParamTypes.string("Original File Name"),
};

PageImage.paramsEditorComponent = ImageParamsEditor;

export default PageImage;
