import Component from "./Component";
import { version, componentName } from "../package.json";
import { icon } from "./metadata";

// Set Component Metadata
Component.displayName = componentName;
Component.version = version;
Component.icon = icon;

export default Component;
