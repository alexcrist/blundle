import { useEffect, useState } from "react";
import { getCountriesGeoJson } from "./getCountry";

export const useCountriesGeojson = () => {
    const [countriesGeojson, setCountriesGeojson] = useState(null);
    useEffect(() => {
        (async () => {
            const geojson = await getCountriesGeoJson();
            setCountriesGeojson(geojson);
        })();
    }, []);
    return countriesGeojson;
};
