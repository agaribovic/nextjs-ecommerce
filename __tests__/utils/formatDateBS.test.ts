import { formatDateBS } from "@/utils/formatDate";

describe("formatDateBS", () => {
  it("formats a valid date string correctly", () => {
    expect(formatDateBS("2024-03-15")).toBe("15. mart 2024");
  });

  it("formats a Date object correctly", () => {
    const date = new Date(2025, 10, 2);
    expect(formatDateBS(date)).toBe("2. novembar 2025");
  });

  it("handles single-digit days (no leading zero)", () => {
    expect(formatDateBS("2024-01-05")).toBe("5. januar 2024");
  });

  it("returns empty string for invalid date string", () => {
    expect(formatDateBS("invalid-date")).toBe("");
  });

  it("returns empty string for invalid Date object", () => {
    expect(formatDateBS(new Date("invalid"))).toBe("");
  });

  it("handles end of year correctly", () => {
    expect(formatDateBS("2023-12-31")).toBe("31. decembar 2023");
  });

  it("handles beginning of year correctly", () => {
    expect(formatDateBS("2023-01-01")).toBe("1. januar 2023");
  });
});
