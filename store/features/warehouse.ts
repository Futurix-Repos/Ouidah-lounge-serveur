import {createSlice} from "@reduxjs/toolkit";

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    currentTab: "général",
  },
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});
export const {setCurrentTab} = warehouseSlice.actions;
export default warehouseSlice.reducer;
