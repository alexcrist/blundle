import { useEffect, useState } from "react";
import { getCountry } from "./getCountry";

export const useCountry = () => {
    const [country, setCountry] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const country = await getCountry();
                setCountry(country);
            } catch (error) {
                console.error(error);
                alert("Error: failed to retrieve a country.");
            }
        })();
    }, []);
    return country;
};
