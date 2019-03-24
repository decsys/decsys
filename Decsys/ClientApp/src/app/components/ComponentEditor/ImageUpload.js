import React, { useState } from "react";
import { Button, Input, Box } from "@smooth-ui/core-sc";
import { FlexBox } from "../ui";

const ImageUpload = ({ params, onAddClick, onRemoveClick }) => {
  const hasImage = !!params.id;

  const [image, setImage] = useState();
  const [fileExtension, setFileExtension] = useState();

  const handleFileSelect = e => {
    e.persist();
    setImage(e.target.files[0]);
    setFileExtension(`.${e.target.value.split(".").pop()}`);
  };

  const handleAddClick = () => {
    if (!image) return;
    if (
      ![".jpg", ".jpeg", ".png", ".gif"].includes(fileExtension.toLowerCase())
    )
      // TODO: make this a nice modal one day
      return alert("Only JPEG, PNG and GIF images are allowed to be uploaded.");
    onAddClick(image, fileExtension);
  };

  return hasImage ? (
    <Button onClick={onRemoveClick}>Remove Image</Button>
  ) : (
    <Box>
      <Input type="file" onChange={handleFileSelect} />
      <Button onClick={handleAddClick}>Upload Image</Button>
    </Box>
  );
};

export default ImageUpload;
