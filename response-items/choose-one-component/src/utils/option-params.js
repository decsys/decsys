/**
 * Filters options out from props. Maintaing props with non-empty
 * options.
 * @param {*} options 
 */
export const filterOptions = (options) => {
    return Object.entries(options)
        .reduce((acc, [key, val], idx) => {
            if (key.includes("option") && !!val) {
                return [...acc, {
                    option: val,
                    value: idx
                }]
            }

            return acc;
        },[]);
}