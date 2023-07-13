import { createSlice } from "@reduxjs/toolkit";

const loginResponseSlice = createSlice({
  name: "loginResponse",
  initialState: {
    codeResponse: undefined,
  },
  reducers: {
    AccessToken: (state, action) => {
      console.log("calling set access token...")
      console.log(action.payload);
      state.codeResponse = action.payload;
    },
  },
});
export default loginResponseSlice;
