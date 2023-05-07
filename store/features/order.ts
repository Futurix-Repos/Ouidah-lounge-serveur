import {createSlice} from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    tab: "pending",
    statusModal: false,
  },
  reducers: {
    setOrderTab: (state, action) => {
      state.tab = action.payload;
    },
    openStatusModal: (state) => {
      state.statusModal = true;
    },
    closeStatusModal: (state) => {
      state.statusModal = false;
    },
  },
});
export const {setOrderTab, openStatusModal, closeStatusModal} = orderSlice.actions;
export default orderSlice.reducer;
