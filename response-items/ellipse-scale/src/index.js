import { Icon } from "./metadata";
import Component from "./Component";
import { version, responseItemName } from "../package.json";

// Set Component Metadata
Component.icon = Icon;
Component.displayName = responseItemName;
Component.version = version;

export default Component;
