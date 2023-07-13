import { createSelector } from "@reduxjs/toolkit";

export const googleLoginSelector = (state) => state.login.userData;

export const accessTokenSelector = (state) => state.loginResponse.codeResponse;

export const currentProjectSelector = (state) => state.projectDetail.currentProject;
