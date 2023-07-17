import { createSlice } from "@reduxjs/toolkit";

const loginResponseSlice = createSlice({
  name: "loginResponse",
  initialState: {
    codeResponse: undefined,
  },
  reducers: {
    AccessToken: (state, action) => {
      state.codeResponse = action.payload;
    },
  },
});
export default loginResponseSlice;
