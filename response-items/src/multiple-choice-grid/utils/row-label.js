/**
 * From a set of props, build an ordered array of row labels
 * in the format `[row1Label, row2Label, ...]`
 * @param {*} props
 */
export const getRowLabels = (props) => {
  return Object.keys(props)
    .filter((key) => key.includes("row") && key.includes("Label"))
    .sort((a, b) => a.match(/\d+/) - b.match(/\d+/))
    .map((key) => props[key]);
};
