import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CakeType } from "@/app/page";

interface CakeState {
  cakeData: CakeType[];
  sortedCakes: CakeType[];
  sortValue: string;
}

const initialState: CakeState = {
  cakeData: [],
  sortedCakes: [],
  sortValue: "",
};

export const cakeSlice = createSlice({
  name: "CakeData",
  initialState,
  reducers: {
    setCakeData: (state, action: PayloadAction<CakeType[]>) => {
      state.cakeData = action.payload;
      state.sortedCakes = [...action.payload];
    },
    setSortedCakes: (state, action: PayloadAction<CakeType[]>) => {
      state.sortedCakes = [...action.payload];
    },
    setSortValue: (state, action: PayloadAction<string>) => {
      state.sortValue = action.payload;
    },
    removeCake: (state, action: PayloadAction<number>) => {
      const cakeId = action.payload;
      state.cakeData = state.cakeData.filter((cake) => cake.id !== cakeId);
      state.sortedCakes = state.sortedCakes.filter(
        (cake) => cake.id !== cakeId
      );
    },
    updateCake: (state, action: PayloadAction<CakeType>) => {
      const updatedCake = action.payload;
      const index = state.cakeData.findIndex(
        (cake) => cake.id === updatedCake.id
      );
      if (index !== -1) {
        state.cakeData[index] = updatedCake;
      }
      const sortedIndex = state.sortedCakes.findIndex(
        (cake) => cake.id === updatedCake.id
      );
      if (sortedIndex !== -1) {
        state.sortedCakes[sortedIndex] = updatedCake;
      }
    },
    addNewCake: (state, action: PayloadAction<CakeType>) => {
      state.cakeData.unshift(action.payload);
      state.sortedCakes.unshift(action.payload);
    },
  },
});

export const {
  setCakeData,
  setSortedCakes,
  setSortValue,
  removeCake,
  updateCake,
  addNewCake,
} = cakeSlice.actions;
export default cakeSlice.reducer;
