import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/Login/loginSlice";

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

// import { createStore } from "redux";
// import rootReducer from "./reducer";

// const store = createStore(rootReducer);

export default store;
