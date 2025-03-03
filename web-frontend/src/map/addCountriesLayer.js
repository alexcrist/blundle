import { getCountriesGeoJson } from "../countries/getCountry";
import { addGeoJsonLayer } from "./map";

const COUNTRY_FILL_COLOR = "#C8F0BF";
const COUNTRY_STROKE_COLOR = "#1E710C";

export const addCountriesLayer = async (map) => {
    const geojson = await getCountriesGeoJson();
    addGeoJsonLayer(map, geojson, {
        fillColor: COUNTRY_FILL_COLOR,
        fillOpacity: 1,
        strokeColor: COUNTRY_STROKE_COLOR,
        strokeOpacity: 1,
        strokeWidth: 1,
    });
};
