import cakeReducer, {
  setCakeData,
  setSortedCakes,
  setSortValue,
} from "@/redux/slices/cakeDataSlice";
import { CakeType } from "@/app/page";
import { mockCakes } from "../mockCakes";

const initialState = {
  cakeData: [] as CakeType[],
  sortedCakes: [] as CakeType[],
  sortValue: "",
};

describe("cakeDataSlice", () => {
  it("should return the initial state", () => {
    expect(cakeReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should set cakeData and sortedCakes", () => {
    const nextState = cakeReducer(initialState, setCakeData(mockCakes));
    expect(nextState.cakeData).toEqual(mockCakes);
    expect(nextState.sortedCakes).toEqual(mockCakes);
  });

  it("should set sortedCakes", () => {
    const nextState = cakeReducer(initialState, setSortedCakes([mockCakes[1]]));
    expect(nextState.sortedCakes).toEqual([mockCakes[1]]);
  });

  it("should set sortValue", () => {
    const nextState = cakeReducer(initialState, setSortValue("price-asc"));
    expect(nextState.sortValue).toBe("price-asc");
  });
});
