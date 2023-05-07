import {createSlice} from "@reduxjs/toolkit";

const initialState: {
  content: {id: string; name: string; price: number; qty: number; image: string}[];
} = {content: []};
const orderSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = state.content.find((item) => item.id === action.payload.id);
      if (!item) state.content.push({...action.payload, qty: 1});
    },
    deleteItem: (state, action) => {
      state.content = state.content.filter((item) => item.id != action.payload.id);
    },
    increaseItemQty: (state, action) => {
      const item = state.content.find((item) => item.id === action.payload.id);
      if (item) item.qty++;
    },
    decreaseItemQty: (state, action) => {
      const item = state.content.find((item) => item.id === action.payload.id);
      if (item) {
        if (item.qty === 1) {
          state.content = state.content.filter((item) => item.id != action.payload.id);
        } else {
          item.qty--;
        }
      }
    },
    resetCart: (state) => {
      state.content = [];
    },
  },
});
export const {addItem, deleteItem, increaseItemQty, decreaseItemQty, resetCart} =
  orderSlice.actions;
export default orderSlice.reducer;
