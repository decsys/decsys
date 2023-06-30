import { describe, it, expect } from "vitest";
import generateGfyCatStyleUrl from "./gfycat-style-urls";

describe("generateGfyCatStyleUrl", () => {
  it("should not include excluded built-in words in the string", () => {
    const excludedBuiltins = ["lazy", "cat"];
    const result = generateGfyCatStyleUrl(excludedBuiltins, 1, "", true);
    expect(result.includes("Lazy")).toBe(false);
    expect(result.includes("Cat")).toBe(false);
  });

  it("should throw an error for non-array excludedBuiltins", () => {
    expect(() => generateGfyCatStyleUrl("not an array", 1, "", true)).toThrow();
  });

  it("should return only a noun when numAdjectives is 0", () => {
    const result = generateGfyCatStyleUrl([], 0, "", true);
    const words = result.split(/(?=[A-Z])/);
    expect(words.length).toBe(1);
  });

  it("should return a string with the correct number of adjectives", () => {
    const numAdjectives = 2;
    const result = generateGfyCatStyleUrl([], numAdjectives, "", true);
    const words = result.split(/(?=[A-Z])/);
    expect(words.length - 1).toBe(numAdjectives); // -1 to not count the animal noun
  });

  it("should return a string with only one noun", () => {
    const numAdjectives = 2;
    const result = generateGfyCatStyleUrl([], numAdjectives, "", true);
    const words = result.split(/(?=[A-Z])/);
    expect(words.length - numAdjectives).toBe(1); // 1, because only one noun should be in the result string
  });

  it("should return a string with capitalized words if capitalizeFirstLetter is true", () => {
    const result = generateGfyCatStyleUrl([], 1, "", true);
    const words = result.split(/(?=[A-Z])/);
    words.forEach((word) => {
      expect(word[0]).toBe(word[0].toUpperCase());
    });
  });

  it("should return a string with lowercase words if capitalizeFirstLetter is false", () => {
    const result = generateGfyCatStyleUrl([], 1, "", false);
    const words = result.split(" ");
    words.forEach((word) => {
      expect(word[0]).toBe(word[0].toLowerCase());
    });
  });

  it("should return a string with correct delimiter", () => {
    const delimiter = "-";
    const result = generateGfyCatStyleUrl([], 1, delimiter, true);
    expect(result.includes(delimiter)).toBe(true);
  });
});
