import {createSlice} from "@reduxjs/toolkit"

const categorySlice = createSlice({
  name: "productCategory",
  initialState: {
    tab: "tout",
    searchTerm: "",
  },
  reducers: {
    setProductCategory: (state, action) => {
      state.tab = action.payload
    },
    setSearchTerm: (state, action) => {
      //if (action.payload.length) state.tab = "all";
      state.searchTerm = action.payload
    },
  },
})
export const {setProductCategory, setSearchTerm} = categorySlice.actions
export default categorySlice.reducer
