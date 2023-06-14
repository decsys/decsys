/**
 * Generates a list of WordCard models based on the source word list,
 * excluded words dictionary, and word type.
 * @param {string[]} words - The source word list.
 * @param {Object} excludeWordsDict - The dictionary of words to check for exclusion.
 * @param {string} wordsType - The type of the words (e.g., 'adjective', 'noun').
 * @returns {Object[]} - The list of WordCard models.
 */
export const getFilteredWordList = (
  words = [],
  excludeWordsDict = {},
  wordsType
) => {
  return words.map((word) => {
    const excludedWord = excludeWordsDict[word];
    const isExcluded = excludedWord && excludedWord.type === wordsType;

    return {
      type: wordsType,
      word,
      isCustomWord: false,
      isExcluded: isExcluded || false,
    };
  });
};
