import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        guessedCountryNames: [],
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        addGuessedCountryName: (state, action) => {
            state.guessedCountryNames.unshift(action.payload);
        },
    },
});

export default mainSlice;
