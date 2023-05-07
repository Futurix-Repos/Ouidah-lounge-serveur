import {createSlice} from "@reduxjs/toolkit";

const zoneSlice = createSlice({
  name: "zone",
  initialState: {
    tab: "",
  },
  reducers: {
    setCurrentZone: (state, action) => {
      state.tab = action.payload;
    },
  },
});
export const {setCurrentZone} = zoneSlice.actions;
export default zoneSlice.reducer;
