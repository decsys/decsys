import { useState } from "react";
import { Button, Input, Stack, Flex } from "@chakra-ui/react";
import { uploadPageItemImage, deletePageItemImage } from "api/survey-images";

const ImageParamsEditor = ({
  _context: { surveyId, pageId, itemId, handleParamChange, ParamsEditor },
  renderComponent,
  params,
}) => {
  const hasImage = !!params.extension;

  const [image, setImage] = useState();
  const [fileExtension, setFileExtension] = useState();
  const [originalFilename, setOriginalFilename] = useState();

  const handleFileSelect = (e) => {
    e.persist();
    setImage(e.target.files[0]);
    setFileExtension(`.${e.target.value.split(".").pop()}`);
    setOriginalFilename(`.${e.target.files[0].name}`);
  };
  
  const handleAddClick = () => {
    if (!image) return;
    if (
      ![".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension.toLowerCase())
    ) {
      // TODO: make this a nice modal one day
      return alert("Only JPEG, PNG and GIF images are allowed to be uploaded.");
    }

    uploadPageItemImage(surveyId, pageId, itemId, image);
    handleParamChange("extension", fileExtension);
    handleParamChange("originalFilename", originalFilename);
  };

  const handleRemoveClick = () => {
    deletePageItemImage(surveyId, pageId, itemId);
    handleParamChange("extension");
  };

  // modify the params list so we only edit manually configurable ones
  const editableParams = { ...renderComponent.params, extension: undefined };
  
  if (hasImage)
    return (
      <Stack w="100%">
        <Flex justify="center">
          <Button m={2} colorScheme="red" onClick={handleRemoveClick}>
            Remove Image
          </Button>
        </Flex>
        <Input
            size="sm"
            type="text"
            value={text}
            readOnly
          />
        <ParamsEditor // render the standard Params Editor too, but exclude params our custom editor handles
          component={{ ...renderComponent, params: editableParams }}
          params={params}
          handleParamChange={handleParamChange}
        />
      </Stack>
    );

  return (
    <Stack direction="row" p={2} width="100%">
      <Input type="file" onChange={handleFileSelect} />
      <Button colorScheme="blue" onClick={handleAddClick}>
        Upload Image
      </Button>
    </Stack>
  );
};

export default ImageParamsEditor;
