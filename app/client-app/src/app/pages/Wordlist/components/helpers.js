/**
 * Transforms an array of words into an array of WordCard models, marking excluded words based on the provided exclusion dictionary and word type.
 * @param {string[]} words - The source word list.
 * @param {Object} excludedBuiltinsDict - The dictionary of words to check for exclusion.
 * @param {string} wordsType - The type of the words (e.g., 'adjective', 'noun').
 * @returns {Object[]} - The list of WordCard models.
 */
export const getFilteredWordList = (
  words = [],
  excludedBuiltinsDict = {},
  wordsType
) => {
  return words.map((word) => {
    const excludedWord = excludedBuiltinsDict[word];
    const isExcluded = excludedWord && excludedWord.type === wordsType;

    return {
      type: wordsType,
      word,
      isCustomWord: false,
      isExcluded: isExcluded || false,
    };
  });
};
