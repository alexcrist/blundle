import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCountryFromName } from "./getCountry";

export const useGuessedCountries = () => {
    const [guessedCountries, setGuessedCountries] = useState([]);
    const countryNames = useSelector((state) => state.main.guessedCountryNames);
    useEffect(() => {
        (async () => {
            const guessedCountries = await Promise.all(
                countryNames.map(async (countryName) => {
                    return getCountryFromName(countryName);
                }),
            );
            setGuessedCountries(guessedCountries);
        })();
    }, [countryNames]);
    return guessedCountries;
};
