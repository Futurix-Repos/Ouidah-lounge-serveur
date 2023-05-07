import {createSlice} from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "menu",
  initialState: {
    open: false,
    orderId: "",
    orderItem: false,
  },
  reducers: {
    openMenu: (state) => {
      state.open = true;
    },
    closeMenu: (state) => {
      state.open = false;
    },
    openMenuItem: (state) => {
      state.orderItem = true;
    },
    closeMenuItem: (state) => {
      state.orderItem = false;
    },

    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
  },
});
export const {openMenu, closeMenu, setOrderId, openMenuItem, closeMenuItem} = orderSlice.actions;
export default orderSlice.reducer;
