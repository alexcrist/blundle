import { useEffect, useState } from "react";
import { getTargetCountry } from "./getCountry";

export const useTargetCountry = () => {
    const [country, setCountry] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const country = await getTargetCountry();
                setCountry(country);
            } catch (error) {
                console.error(error);
                // alert("Error: failed to retrieve a country.");
            }
        })();
    }, []);
    return country;
};
