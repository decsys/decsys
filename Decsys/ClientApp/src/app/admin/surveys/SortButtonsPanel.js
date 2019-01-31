import React from "react";

import SortButton from "./SortButton";

const SortButtonsPanel = ({ keys, current, sorter }) =>
  keys.map((sortKey, i) => {
    const button = (label, key) => (
      <SortButton key={i} sortby={key} current={current} sorter={sorter}>
        {label}
      </SortButton>
    );
    return typeof sortKey === "string"
      ? button(sortKey, sortKey.toLocaleLowerCase())
      : button(sortKey[0], sortKey[1]);
  });

export default SortButtonsPanel;
