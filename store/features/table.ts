import {createSlice} from "@reduxjs/toolkit";

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tab: "",
  },
  reducers: {
    setCurrentTable: (state, action) => {
      state.tab = action.payload;
    },
  },
});
export const {setCurrentTable} = tableSlice.actions;
export default tableSlice.reducer;
