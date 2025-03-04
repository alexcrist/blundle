import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTargetCountryForSeed } from "./countries/useTargetCountry";
import mainSlice from "./mainSlice";
import { MODAL_TRANSITION_TIME_MS } from "./Modal/Modal";

export const useReset = () => {
    const dispatch = useDispatch();
    const oldSeed = useSelector((state) => state.main.randomSeed);
    return useCallback(() => {
        dispatch(mainSlice.actions.reset());
        setTimeout(() => {
            requestAnimationFrame(() => {
                setNewRandomSeed(dispatch, oldSeed);
            });
        }, MODAL_TRANSITION_TIME_MS);
    }, [dispatch, oldSeed]);
};

export const setNewRandomSeed = async (dispatch, oldSeed) => {
    let newSeed;
    let newCountry;
    const oldCountry = await getTargetCountryForSeed(oldSeed);
    do {
        newSeed = Math.random();
        newCountry = await getTargetCountryForSeed(newSeed);
    } while (oldCountry.name === newCountry.name);
    dispatch(mainSlice.actions.setRandomSeed(newSeed));
};
