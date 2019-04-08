import * as sut from "./instance-id";

// TODO: More, better

describe("decode", () => {
  it("should decode", () => {
    expect(sut.decode("aza")).toEqual([0, 0]);
  });

  it("should decode", () => {
    expect(sut.decode("bzb")).toEqual([1, 1]);
  });
});
