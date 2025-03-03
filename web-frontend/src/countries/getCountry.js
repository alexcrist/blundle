import turfBbox from "@turf/bbox";
import { ENDONYMS } from "./endonyms";

const MIN_POPULATION = 1000;
const MAX_ENDONYMS = 2;
const IGNORED_TERRITORIES = [
    "Dhekelia Cantonment",
    "Guantanamo Bay Naval Base",
    "United Nations Buffer Zone in Cyprus",
    "Siachen Glacier",
    "Akrotiri Sovereign Base Area",
];
const EXONYM_MAP = {
    "Ivory Coast": "Côte d'Ivoire",
    "People's Republic of China": "China",
};

// This dataset is from https://www.naturalearthdata.com/
const COUNTRIES_GEOJSON_PROMISE = import("./ne_10m_admin_0_countries.json");

const COUNTRIES_PROMISE = (async () => {
    const data = (await COUNTRIES_GEOJSON_PROMISE).default;
    return data.features
        .filter((geojson) => {
            const population = geojson.properties.POP_EST;
            return (
                !IGNORED_TERRITORIES.includes(geojson.properties.NAME_EN) &&
                population > MIN_POPULATION
            );
        })
        .map((geojson) => {
            const bbox = turfBbox(geojson);
            const { properties } = geojson;
            let exonym = properties.NAME_EN;
            if (EXONYM_MAP[exonym]) {
                exonym = EXONYM_MAP[exonym];
            }
            let endonyms = ENDONYMS[exonym];
            if (!endonyms) {
                console.warn(`Could not find endonyms for ${exonym}`);
                endonyms = [];
            }
            let allNames = exonym;
            endonyms
                .filter((endonym) => endonym !== exonym)
                .filter((__, index) => index < MAX_ENDONYMS)
                .forEach((endonym) => (allNames += "\n" + endonym));
            console.info(exonym);
            const countryFormatted = {
                name: exonym,
                allNames,
                codeIso3: properties.ISO_A3,
                geojson,
                bbox,
                coordLonLat: [properties.LABEL_X, properties.LABEL_Y],
                nameLon: properties.LABEL_X,
                nameLat: properties.LABEL_Y,
                type: properties.TYPE,
                regionUn: properties.REGION_UN,
                regionWb: properties.REGION_WB,
                subRegion: properties.SUBREGION,
                continent: properties.CONTINENT,
            };
            for (const key in countryFormatted) {
                if (!countryFormatted[key]) {
                    throw Error(`Missing key ${key} from ${properties}`);
                }
            }
            return countryFormatted;
        });
})();

let seed = Math.random();

export const getTargetCountry = async () => {
    const countries = await getCountries();
    const index = Math.floor(seed * countries.length);
    return countries[index];
};

export const getCountries = async () => {
    const countries = await COUNTRIES_PROMISE;
    return countries;
};

export const getCountriesGeoJson = async () => {
    const countriesGeojson = (await COUNTRIES_GEOJSON_PROMISE).default;
    return countriesGeojson;
};

export const getCountryFromName = async (name) => {
    const countries = await getCountries();
    return countries.find((country) => country.name === name);
};
