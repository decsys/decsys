import {
  PageSpacer,
  PageImage,
  PageParagraph,
  PageHeading
} from "components/page-items";

export const builtInLookup = {
  heading: PageHeading,
  paragraph: PageParagraph,
  image: PageImage,
  spacer: PageSpacer
};

/**
 * Note: This currently assumes only one component
 * passed in is not a built in component.
 * This holds true for the Survey Platform at the time of writing.
 * @param {*} components
 */
export const getResponseComponent = components =>
  components.reduce((_, c) => (isBuiltIn(c.type) ? null : c), null);

export const isBuiltIn = type => Object.keys(builtInLookup).includes(type);

export const getComponent = type =>
  isBuiltIn(type) ? builtInLookup[type] : window.__DECSYS__.Components[type];
