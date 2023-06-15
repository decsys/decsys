import { getFilteredWordList } from "./helpers.js";
import { describe, expect, it } from "vitest";

describe("getFilteredWordList", () => {
  it("should return an empty list when no words are passed", () => {
    const words = [];
    const excludeWordsDict = { rabbit: { type: "noun" } };

    expect(getFilteredWordList(words, excludeWordsDict, "noun")).toEqual([]);
  });

  it("should map a list of words to WordCard models, even if no dictionary or type is provided", () => {
    const words = ["rabbit", "cat", "dog"];
    const excludeWordsDict = {};
    const result = getFilteredWordList(words, excludeWordsDict, "noun");
    const expected = [
      { type: "noun", word: "rabbit", isCustomWord: false, isExcluded: false },
      { type: "noun", word: "cat", isCustomWord: false, isExcluded: false },
      { type: "noun", word: "dog", isCustomWord: false, isExcluded: false },
    ];

    expect(result).toEqual(expected);
  });

  it("should map a list of words to WordCard models and correctly exclude words", () => {
    const words = ["apple", "banana", "cherry"];
    const excludeWordsDict = {
      cat: { type: "noun" },
      dog: { type: "noun" },
    };
    const result = getFilteredWordList(words, excludeWordsDict, "adjective");
    const expected = [
      {
        type: "adjective",
        word: "apple",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "banana",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "cherry",
        isCustomWord: false,
        isExcluded: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("should return a complete list mapped to WordCard models when a dictionary of excluded words and a different type argument are provided", () => {
    const words = ["apple", "banana", "cherry"];
    const excludeWordsDict = {
      cat: { type: "noun" },
      dog: { type: "noun" },
    };
    const result = getFilteredWordList(words, excludeWordsDict, "adjective");
    const expected = [
      {
        type: "adjective",
        word: "apple",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "banana",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "cherry",
        isCustomWord: false,
        isExcluded: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("should return a modified list, containing only the words not matched by the excluded words of the matching type", () => {
    const words = ["cat", "dog", "rabbit"];
    const excludeWordsDict = {
      cat: { type: "noun" },
      dog: { type: "noun" },
    };
    const result = getFilteredWordList(words, excludeWordsDict, "noun");
    const expected = [
      {
        type: "noun",
        word: "cat",
        isCustomWord: false,
        isExcluded: true,
      },
      {
        type: "noun",
        word: "dog",
        isCustomWord: false,
        isExcluded: true,
      },
      {
        type: "noun",
        word: "rabbit",
        isCustomWord: false,
        isExcluded: false,
      },
    ];
    expect(result).toEqual(expected);
  });
});
