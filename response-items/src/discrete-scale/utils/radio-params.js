/**
 * get radio params from all other props
 * (or more accurately, strip out anything the Platform passes
 * that we don't need, like `logEvent` or other API methods)
 * @param {*} p props including radio params
 */
export const getRadioParams = (p) => {
  return Object.keys(p).reduce((acc, key) => {
    if (key.includes("radio")) acc[key] = p[key];
    return acc;
  }, {});
};

/**
 * From a set of Radio Parameters, build an ordered Radios array
 * for use in the Discrete Ratings Scale, in the format
 * `[[primary label], [secondary label], ...]`
 * @param {*} radioParams
 */
export const getRadios = (radioParams) => {
  return Object.keys(radioParams)
    .sort((a, b) => a.match(/\d+/) - b.match(/\d+/)) // guarantee ascending numeric order
    .reduce((acc, key) => {
      if (key.includes("Secondary")) return acc; // ignore secondary params

      const secondaryKey = `${key}Secondary`;

      if (!radioParams[key] && !radioParams[secondaryKey]) return acc;

      const radio = [radioParams[key], radioParams[secondaryKey]];

      acc.push(radio);
      return acc;
    }, []);
};
