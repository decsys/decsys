import ResponseItem from "./ResponseItem";
import { version, responseItemName } from "../package.json";
import { Icon } from "./metadata";

// Set ResponseItem Metadata
ResponseItem.displayName = responseItemName;
ResponseItem.version = version;
ResponseItem.icon = Icon;

export default ResponseItem;
