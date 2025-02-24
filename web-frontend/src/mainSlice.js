import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
    },
});

export default mainSlice;
