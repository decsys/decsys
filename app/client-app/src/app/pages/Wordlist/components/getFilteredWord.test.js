import { getFilteredWordList } from "./helpers.js";
import { describe, expect, it } from "vitest";

describe("getFilteredWordList", () => {
  it("should return an empty list when no words are passed", () => {
    const words = [];
    const excludedBultinDict = { rabbit: { type: "noun" } };

    expect(getFilteredWordList(words, excludedBultinDict, "noun")).toEqual([]);
  });

  it("should map a list of words to WordCard models, for an empty dictionary", () => {
    const words = ["rabbit", "cat", "dog"];
    const excludedBultinDict = {};
    const result = getFilteredWordList(words, excludedBultinDict, "noun");
    const expected = [
      { type: "noun", word: "rabbit", isCustomWord: false, isExcluded: false },
      { type: "noun", word: "cat", isCustomWord: false, isExcluded: false },
      { type: "noun", word: "dog", isCustomWord: false, isExcluded: false },
    ];

    expect(result).toEqual(expected);
  });

  it("should map a list of words to WordCard models and correctly exclude words", () => {
    const words = ["cat", "dog"];
    const excludedBultinDict = {
      cat: { type: "adjective" },
    };
    const result = getFilteredWordList(words, excludedBultinDict, "adjective");
    const expected = [
      {
        type: "adjective",
        word: "cat",
        isCustomWord: false,
        isExcluded: true,
      },
      {
        type: "adjective",
        word: "dog",
        isCustomWord: false,
        isExcluded: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("should return a complete list mapped to WordCard models when a dictionary of excluded words and a different type argument are provided", () => {
    const words = ["happy", "sad", "excited"];
    const excludedBultinDict = {
      happy: { type: "noun" },
      sad: { type: "noun" },
    };
    const result = getFilteredWordList(words, excludedBultinDict, "adjective");
    const expected = [
      {
        type: "adjective",
        word: "happy",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "sad",
        isCustomWord: false,
        isExcluded: false,
      },
      {
        type: "adjective",
        word: "excited",
        isCustomWord: false,
        isExcluded: false,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("should correctly mark words as excluded in the mapped WordCard models when both word and type match those in the exclusion dictionary", () => {
    const words = ["cat", "dog", "rabbit"];
    const excludedBultinDict = {
      cat: { type: "noun" },
      dog: { type: "noun" },
    };
    const result = getFilteredWordList(words, excludedBultinDict, "noun");
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
