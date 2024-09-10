import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserInSuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

    }
});

export const { signInFailure, signInStart, signInSuccess,
    updateInStart, updateInSuccess, updateInFailure,
    deleteUserInStart, deleteUserInSuccess, deleteUserInFailure,
} = userSlice.actions;

export default userSlice.reducer;
