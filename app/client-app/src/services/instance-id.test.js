import * as sut from "./instance-id";
import { describe, expect, it } from "vitest";
// TODO: More, better

describe("decode", () => {
  it("should decode", () => {
    expect(sut.decode("aza")).toEqual([0, 0]);
  });

  it("should decode", () => {
    expect(sut.decode("bzb")).toEqual([1, 1]);
  });
});
