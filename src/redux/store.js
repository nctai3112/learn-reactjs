import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginSlice from "../features/Login/loginSlice";
import loginResponseSlice from "../features/Login/loginResponseSlice"
import projectDetailSlide from "../features/ProjectDetail/projectDetailSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  login: loginSlice.reducer,
  loginResponse: loginResponseSlice.reducer,
  projectDetail: projectDetailSlide.reducer,
});

const persistConfig = {
  key: "root", // key for the root level of the persisted state
  storage, // storage engine to use
  // Add any additional configuration options if needed
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // any other configuration options you need
});

const persistor = persistStore(store);

export { store, persistor };
