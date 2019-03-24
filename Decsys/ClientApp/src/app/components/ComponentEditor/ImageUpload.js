import React, { useState } from "react";
import { Button } from "@smooth-ui/core-sc";

const ImageUpload = ({ id, params }) => {
  const hasImage = !!params.id;
  return hasImage ? (
    <Button>Remove Image</Button>
  ) : (
    <div>No image here. Upload one?</div>
  );
};
