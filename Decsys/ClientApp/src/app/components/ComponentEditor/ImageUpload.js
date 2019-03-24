import React, { useState } from "react";
import { Button } from "@smooth-ui/core-sc";
import { FlexBox } from "../ui";

const ImageUpload = ({ params, onAddClick, onRemoveClick }) => {
  const hasImage = !!params.id;

  const [image, setImage] = useState();
  const [fileExtension, setFileExtension] = useState();

  const handleFileSelect = ({ target }) => {
    setImage(target.files[0]);
    setFileExtension(target.value.split(".").pop());
  };

  return hasImage ? (
    <Button onClick={onRemoveClick}>Remove Image</Button>
  ) : (
    <FlexBox flexDirection="column">
      <Input type="file" onChange={handleFileSelect} />
      <Button onClick={() => onAddClick(image, fileExtension)}>
        Upload Image
      </Button>
    </FlexBox>
  );
};
