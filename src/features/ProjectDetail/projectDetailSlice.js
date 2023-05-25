import { createSlice } from "@reduxjs/toolkit";

const projectDetailSlide = createSlice({
  name: "projectDetail",
  initialState: {
    currentProjectId: "",
  },
  reducers: {
    CurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
});
export default projectDetailSlide;
// const initState = {
//   userData: [],
// };

// const loginReducer = (state = initState, action) => {
//   switch (action.type) {
//     case "GoogleLogin":
//       return {
//         ...state,
//         userData: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default loginReducer;
