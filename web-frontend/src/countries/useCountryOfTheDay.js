import { useEffect, useState } from "react";
import { getCountryOfTheDay } from "./getCountry";

export const useCountryOfTheDay = () => {
    const [country, setCountry] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const country = await getCountryOfTheDay();
                setCountry(country);
            } catch (error) {
                console.error(error);
                alert("Error: failed to retrieve a country.");
            }
        })();
    }, []);
    return country;
};
