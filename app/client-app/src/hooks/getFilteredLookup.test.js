import { expect, it, describe } from "vitest";
import { getFilteredLookup } from "./useSortingAndFiltering";

describe("getFilteredLookup", () => {
  const mockData = [
    { name: "James", age: 30, isEmployed: false },
    { name: "Anna", age: 30, isEmployed: true },
    { name: "Robert", age: 40, isEmployed: true },
    { name: "Michael", age: 50, isEmployed: true },
    { name: "John", age: 60, isEmployed: false },
  ];

  it("Should return the original array when filterConfig is empty", () => {
    const filterConfig = {};
    const filterers = {};

    const output = getFilteredLookup(mockData, filterConfig, filterers);
    expect(output).toEqual(mockData);
  });

  it("filters based on age 30", () => {
    const filterConfig = { age: 30 };
    const filterers = { age: (value, filter) => value.age === filter };

    const output = getFilteredLookup(mockData, filterConfig, filterers);
    expect(output).toEqual([
      { name: "James", age: 30, isEmployed: false },
      { name: "Anna", age: 30, isEmployed: true },
    ]);
  });

  it("filters based on names that start with J", () => {
    const filterConfig = { name: "^J" };
    const filterers = { name: "name" };

    const result = getFilteredLookup(mockData, filterConfig, filterers);
    expect(result).toEqual([
      { name: "James", age: 30, isEmployed: false },
      { name: "John", age: 60, isEmployed: false },
    ]);
  });

  it("filters based on names that contains the letter a", () => {
    const filterConfig = { name: "a" };
    const filterers = { name: "name" };

    const result = getFilteredLookup(mockData, filterConfig, filterers);
    expect(result).toEqual([
      { name: "James", age: 30, isEmployed: false },
      { name: "Anna", age: 30, isEmployed: true },
      { name: "Michael", age: 50, isEmployed: true },
    ]);
  });

  it("filters based on employment status", () => {
    const filterConfig = { isEmployed: true };
    const filterers = { isEmployed: "isEmployed" };

    const result = getFilteredLookup(mockData, filterConfig, filterers);
    expect(result).toEqual([
      { name: "Anna", age: 30, isEmployed: true },
      { name: "Robert", age: 40, isEmployed: true },
      { name: "Michael", age: 50, isEmployed: true },
    ]);
  });

  it("filters based on exact age", () => {
    const filterConfig = { age: 30 };
    const filterers = { age: (value, filter) => value.age === filter };

    const result = getFilteredLookup(mockData, filterConfig, filterers);
    expect(result).toEqual([
      { name: "James", age: 30, isEmployed: false },
      { name: "Anna", age: 30, isEmployed: true },
    ]);
  });
});
