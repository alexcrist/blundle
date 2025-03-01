import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        guessedCountryNames: [],
        isWinModalVisible: false,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        addGuessedCountryName: (state, action) => {
            state.guessedCountryNames.unshift(action.payload);
        },
        setIsWinModalVisible: (state, action) => {
            state.isWinModalVisible = action.payload;
        },
    },
});

export default mainSlice;
