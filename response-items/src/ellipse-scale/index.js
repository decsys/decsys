import ResponseItem from "./ResponseItem";
import { version } from "../../package.json";
import { responseItemName } from "./metadata";
import Icon from "./Icon";

// Set ResponseItem Metadata
ResponseItem.icon = Icon;
ResponseItem.displayName = responseItemName;
ResponseItem.version = version;

export default ResponseItem;
