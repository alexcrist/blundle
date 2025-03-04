import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCountries } from "./getCountry";

export const useTargetCountry = () => {
    const [country, setCountry] = useState(null);
    const randomSeed = useSelector((state) => state.main.randomSeed);
    useEffect(() => {
        (async () => {
            try {
                const countries = await getCountries();
                const index = Math.floor(randomSeed * countries.length);
                const country = countries[index];
                setCountry(country);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [randomSeed]);
    return country;
};
