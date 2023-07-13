import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userData: undefined,
  },
  reducers: {
    GoogleLogin: (state, action) => {
      state.userData = action.payload;
    },
    DeleteGoogleLogin: (state, action) => {
      state.userData = undefined;
    },
  },
});
export default loginSlice;
