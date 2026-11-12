import { combineReducers } from "@reduxjs/toolkit";
// import productReducer from "../features/product/product.slice";
import cartReducer from "../features/cart/Cart.slice";
import authReducer from "../features/auth/userAuth.slice";
// import categoryReducer from "../features/category/category.slice";
import searchReducer from "../features/search/search.slice";

const rootReducer = combineReducers({
  // product: productReducer,
  cart: cartReducer,
  // category: categoryReducer,
  search: searchReducer,
  auth: authReducer,
});
export default rootReducer;
