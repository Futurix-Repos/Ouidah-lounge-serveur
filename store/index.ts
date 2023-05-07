import {combineReducers, configureStore} from "@reduxjs/toolkit";

import orderReducer from "./features/order";
import warehouseReducer from "./features/warehouse";
import tableReducer from "./features/table";
import categoryReducer from "./features/productCategory";
import cartReducer from "./features/cart";
import menuReducer from "./features/menu";
import zoneReducer from "./features/zone";
export let store = configureStore({
  reducer: combineReducers({
    warehouse: warehouseReducer,
    order: orderReducer,
    table: tableReducer,
    productCategory: categoryReducer,
    cart: cartReducer,
    menu: menuReducer,
    zone: zoneReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
