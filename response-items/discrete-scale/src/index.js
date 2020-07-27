import ResponseItem from "./ResponseItem";
import { version, responseItemName } from "../package.json";
import { icon } from "./metadata";

// Set ResponseItem Metadata
ResponseItem.displayName = responseItemName;
ResponseItem.version = version;
ResponseItem.icon = icon;

export default ResponseItem;
