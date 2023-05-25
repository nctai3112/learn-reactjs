import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/Login/loginSlice";
import projectDetailSlide from "../features/ProjectDetail/projectDetailSlice";

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    projectDetail: projectDetailSlide.reducer,
  },
});

// import { createStore } from "redux";
// import rootReducer from "./reducer";

// const store = createStore(rootReducer);

export default store;
