import { getFilteredWordList } from "./helpers.js";
import { describe, expect, it } from "vitest";

describe("getFilteredWordList", () => {
  it("should return an empty list when no words are passed", () => {
    const words = [];
    const excludeWordsDict = {};
    const wordsType = "noun";

    expect(getFilteredWordList(words, excludeWordsDict, wordsType)).toEqual([]);
  });

  it("should map a list of words to WordCard models, even if no dictionary or type is provided", () => {
    const words = ["apple", "banana", "cherry"];
    const excludeWordsDict = {};
    const wordType = "noun";

    const result = getFilteredWordList(words, excludeWordsDict, wordType);

    const expected = words.map((word) => ({
      type: wordType,
      word,
      isCustomWord: false,
      isExcluded: false,
    }));

    expect(result).toEqual(expected);
  });

  it("should map a list of words to WordCard models and correctly exclude words", () => {
    const words = ["apple", "banana", "cherry"];
    const excludeWordsDict = {
      banana: { type: "noun" },
      cherry: { type: "noun" },
    };
    const wordsType = "adjective";

    const result = getFilteredWordList(words, excludeWordsDict, wordsType);

    const expected = words.map((word) => ({
      type: wordsType,
      word,
      isCustomWord: false,
      isExcluded:
        !!excludeWordsDict[word] && excludeWordsDict[word].type === wordsType,
    }));

    expect(result).toEqual(expected);
  });
});
