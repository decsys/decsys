import { icon } from "./metadata";
import Component from "./Component";
import { version, componentName } from "../package.json";

// Set Component Metadata
Component.icon = icon;
Component.displayName = componentName;
Component.version = version;

export default Component;
