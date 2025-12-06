import modalReducer, {
  cakeAdd,
  cakeDetails,
  cakeEdit,
  cakeOrder,
  closeModal,
  ModalValue,
} from "@/redux/slices/modalSlice";
import { mockCakes } from "../mockCakes";

describe("modalSlice", () => {
  const initialState = { value: null, selectedCake: undefined };
  const mockCake = mockCakes[0];

  it("should return the initial state", () => {
    expect(modalReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle cakeAdd", () => {
    const nextState = modalReducer(initialState, cakeAdd(mockCake));
    expect(nextState.value).toBe("cakeAdd");
    expect(nextState.selectedCake).toEqual(mockCake);
  });

  it("should handle cakeDetails", () => {
    const nextState = modalReducer(initialState, cakeDetails(mockCake));
    expect(nextState.value).toBe("cakeDetails");
    expect(nextState.selectedCake).toEqual(mockCake);
  });

  it("should handle cakeEdit", () => {
    const nextState = modalReducer(initialState, cakeEdit(mockCake));
    expect(nextState.value).toBe("cakeEdit");
    expect(nextState.selectedCake).toEqual(mockCake);
  });

  it("should handle cakeOrder", () => {
    const nextState = modalReducer(initialState, cakeOrder(mockCake));
    expect(nextState.value).toBe("cakeOrder");
    expect(nextState.selectedCake).toEqual(mockCake);
  });

  it("should handle closeModal", () => {
    const state = { value: "cakeEdit" as ModalValue, selectedCake: mockCake };
    const nextState = modalReducer(state, closeModal());
    expect(nextState.value).toBeNull();
    expect(nextState.selectedCake).toBeUndefined();
  });
});
