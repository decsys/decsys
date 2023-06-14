/**
 * Generates a filtered list of WordCard models based on the source word list,
 * excluded words dictionary, and word type.
 * @param {string[]} words - The source word list.
 * @param {Object} excludeWordsDict - The dictionary of excluded words.
 * @param {string} wordsType - The type of the words (e.g., 'adjective', 'noun').
 * @returns {Object[]} - The filtered list of WordCard models.
 */

export const getFilteredWordList = (words, excludeWordsDict, wordsType) => {
  return words.map((word) => {
    return {
      type: wordsType,
      word,
      isCustomWord: false,
      isExcluded: !!excludeWordsDict[word],
    };
  });
};