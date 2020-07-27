import { Icon } from "./metadata";
import ResponseItem from "./ResponseItem";
import { version, responseItemName } from "../package.json";

// Set ResponseItem Metadata
ResponseItem.icon = Icon;
ResponseItem.displayName = responseItemName;
ResponseItem.version = version;

export default ResponseItem;
