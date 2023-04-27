import { createSelector } from "@reduxjs/toolkit";

export const googleLoginSelector = (state) => state.login.userData;
