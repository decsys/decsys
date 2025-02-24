import ResponseItem from "./ResponseItem";
import { version } from "../../package.json";
import { responseItemName } from "./metadata";
import Icon from "./Icon";

// Set ResponseItem Metadata
ResponseItem.displayName = responseItemName;
ResponseItem.version = version;
ResponseItem.icon = Icon;

export default ResponseItem;
