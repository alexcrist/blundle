import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        randomSeed: Math.random(),
        isSideMenuOpen: false,
        isMapInitialized: false,
        guessedCountryNames: [],
        isWinModalVisible: false,
    },
    reducers: {
        setIsSideMenuOpen: (state, action) => {
            state.isSideMenuOpen = action.payload;
        },
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        addGuessedCountryName: (state, action) => {
            state.guessedCountryNames.unshift(action.payload);
        },
        setIsWinModalVisible: (state, action) => {
            state.isWinModalVisible = action.payload;
        },
        reset: (state) => {
            state.guessedCountryNames = [];
            state.isWinModalVisible = false;
        },
        setRandomSeed: (state, action) => {
            state.randomSeed = action.payload;
        },
    },
});

export default mainSlice;
