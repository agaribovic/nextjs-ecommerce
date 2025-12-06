import { sortCakes } from "@/utils/sortCakes";
import { mockCakes } from "../mockCakes";

describe("sortCakes util", () => {
  let cakes: typeof mockCakes;

  beforeEach(() => {
    cakes = [...mockCakes];
  });

  it("sorts by name ascending", () => {
    const sorted = sortCakes(cakes, "name-asc");
    const names = sorted.map((c) => c.name);
    expect(names).toEqual(["Apple", "Banana", "Chocolate"]);
  });

  it("sorts by name descending", () => {
    const sorted = sortCakes(cakes, "name-desc");
    const names = sorted.map((c) => c.name);
    expect(names).toEqual(["Chocolate", "Banana", "Apple"]);
  });

  it("sorts by price ascending", () => {
    const sorted = sortCakes(cakes, "price-asc");
    const prices = sorted.map((c) => c.price);
    expect(prices).toEqual([5, 8, 12]);
  });

  it("sorts by price descending", () => {
    const sorted = sortCakes(cakes, "price-desc");
    const prices = sorted.map((c) => c.price);
    expect(prices).toEqual([12, 8, 5]);
  });

  it("sorts by createdAt ascending", () => {
    const sorted = sortCakes(cakes, "createdAt-asc");
    const createdAt = sorted.map((c) => c.createdAt);
    expect(createdAt).toEqual(["2023-12-25", "2024-01-10", "2024-03-01"]);
  });

  it("sorts by createdAt descending", () => {
    const sorted = sortCakes(cakes, "createdAt-desc");
    const createdAt = sorted.map((c) => c.createdAt);
    expect(createdAt).toEqual(["2024-03-01", "2024-01-10", "2023-12-25"]);
  });

  it("returns a copy for default sort", () => {
    const sorted = sortCakes(cakes, "default");
    expect(sorted).toEqual(cakes);
    expect(sorted).not.toBe(cakes);
  });

  it("does not mutate original array", () => {
    const copy = [...cakes];
    sortCakes(cakes, "name-asc");
    expect(cakes).toEqual(copy);
  });

  it("handles empty array", () => {
    const sorted = sortCakes([], "name-asc");
    expect(sorted).toEqual([]);
  });
});
