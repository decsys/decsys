import PageHeading from "../components/page-items/Heading";
import PageParagraph from "../components/page-items/Paragraph";
import PageImage from "../components/page-items/Image";

export const builtInLookup = {
  heading: PageHeading,
  paragraph: PageParagraph,
  image: PageImage
};

export const isBuiltIn = type => Object.keys(builtInLookup).includes(type);

export const getComponent = type =>
  isBuiltIn(type) ? builtInLookup[type] : window.__DECSYS__.Components[type];
