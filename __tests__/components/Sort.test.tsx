import { render, screen, fireEvent } from "@testing-library/react";
import { sortLabels } from "@/utils/sortCakes";
import { mockCakes } from "../mockCakes";
import Sort from "@/components/Sort/Sort";
import Cookies from "js-cookie";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

jest.mock("react-redux", () => {
  const ActualReactRedux = jest.requireActual("react-redux");
  return {
    ...ActualReactRedux,
    useDispatch: () => jest.fn(),
  };
});

describe("Sort Component", () => {
  beforeEach(() => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ price: "asc" })
    );
  });

  test("loads cookie and sets default selected option", () => {
    render(<Sort cakes={mockCakes} onSort={jest.fn()} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;

    const selectedOption = Array.from(select.options).find(
      (opt) => opt.selected
    );
    expect(selectedOption?.value).toBe("");
    expect(selectedOption?.textContent).toBe(sortLabels["price-asc"]);
  });

  test("calls onSort when changed", () => {
    const mockOnSort = jest.fn();

    render(<Sort cakes={mockCakes} onSort={mockOnSort} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "price-desc" } });

    expect(mockOnSort).toHaveBeenCalledTimes(1);
  });

  test("renders all sorting options", () => {
    render(<Sort cakes={mockCakes} onSort={jest.fn()} />);

    Object.values(sortLabels).forEach((label) => {
      const options = screen.getAllByText(label);
      expect(options.length).toBeGreaterThan(0);
    });
  });
});
