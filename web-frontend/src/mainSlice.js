import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        guesses: [],
        toasts: [],
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        addGuess: (state, action) => {
            state.guesses.push(action.payload);
        },
        addToast: (state, action) => {
            state.toasts.push(action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },
    },
});

export default mainSlice;
