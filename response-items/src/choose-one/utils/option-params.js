/**
 * Filters options out from props. Maintaing props with non-empty
 * options.
 * @param {*} options
 */
export const filterOptions = (props) => {
  // to maintain contiguous values despite possible non contiguous option config
  // (e.g. option5, option0, option9 = values [1,0,2] reordered to [0,1,2], not [5,0,9] or [0,5,9])
  // we require 2 passes

  // - one to evaluate the options we care about,
  // and their original numeric value (from which we can order them correctly):
  // e.g. option1(empty), option9, option0, option5 = [9,0,5]
  const includeOptions = Object.entries(props).reduce(
    (options, [key, label]) => {
      const value = parseInt(key.replace("option", ""));
      if (!isNaN(value) && !!label) {
        return [
          ...options,
          {
            label,
            value,
          },
        ];
      }

      return options;
    },
    []
  );

  // - one to revalue them based on the new ordered subset of configured options: [0,5,9] = [0,1,2]
  return includeOptions
    .sort(({ value: a }, { value: b }) => a - b)
    .map((x, i) => ({ ...x, value: i }));
};
