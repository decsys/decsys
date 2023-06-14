import * as sut from "./helpers.js";
import { describe, expect, it } from "vitest";

describe("return an object", () => {
  it("should get an empty list"),
    () => {
      expect(sut.getFilteredWordList()).toBe({});
    };
});
