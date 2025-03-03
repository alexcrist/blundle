import {
    bbox as turfBbox,
    featureCollection as turfFeatureCollection,
    multiPolygon as turfMultiPolygon,
    union as turfUnion,
} from "@turf/turf";
import _ from "lodash";
import { ENDONYMS } from "./endonyms";

const MIN_POPULATION = 1000;
const COUNTRIES_TO_COMBINE = [
    {
        parentCountryName: "Cyprus",
        countryNames: [
            "Cyprus",
            "Turkish Republic of Northern Cyprus",
            "United Nations Buffer Zone in Cyprus",
        ],
    },
    {
        parentCountryName: "Somalia",
        countryNames: ["Somalia", "Somaliland"],
    },
];
const IGNORED_COUNTRIES = [
    "Dhekelia Cantonment",
    "Guantanamo Bay Naval Base",
    "Siachen Glacier",
    "Akrotiri Sovereign Base Area",
    "Baikonur",
    "British Indian Ocean Territory",
];
const EXONYM_MAP = {
    "Ivory Coast": "Côte d'Ivoire",
    "People's Republic of China": "China",
    "Australian Indian Ocean Territories": "Christmas Island and Cocos Islands",
    "East Timor": "Timor-Leste",
};

// This dataset is from https://www.naturalearthdata.com/
const COUNTRIES_GEOJSON_PROMISE = (async () => {
    const geojson = (await import("./ne_10m_admin_0_countries.json")).default;
    const allCombinedCountryNames = [];
    const combinedCountries = COUNTRIES_TO_COMBINE.map(
        ({ parentCountryName, countryNames }) => {
            allCombinedCountryNames.push(...countryNames);
            const parentCountry = geojson.features.find((feature) => {
                return feature.properties.NAME_EN === parentCountryName;
            });
            const countryPolygons = countryNames.map((countryName) => {
                const country = geojson.features.find((feature) => {
                    return feature.properties.NAME_EN === countryName;
                });
                if (!country) {
                    throw Error(`Could not find ${countryName}`);
                }
                return turfMultiPolygon(country.geometry.coordinates);
            });
            const union = turfUnion(turfFeatureCollection(countryPolygons));
            union.properties = parentCountry.properties;
            return union;
        },
    );
    geojson.features = geojson.features.filter((feature) => {
        const isCombinedCountry = allCombinedCountryNames.includes(
            feature.properties.NAME_EN,
        );
        return !isCombinedCountry;
    });
    geojson.features.push(...combinedCountries);
    return geojson;
})();

const COUNTRIES_PROMISE = (async () => {
    const data = await COUNTRIES_GEOJSON_PROMISE;
    return data.features
        .filter((geojson) => {
            const population = geojson.properties.POP_EST;
            return (
                !IGNORED_COUNTRIES.includes(geojson.properties.NAME_EN) &&
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
                endonyms = [];
                console.warn(`Could not find endonyms for ${exonym}`);
            }
            endonyms = endonyms.filter((endonym) => endonym !== exonym);
            const countryFormatted = {
                name: exonym,
                endonyms,
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
(async () => {
    const countries = await COUNTRIES_PROMISE;
    console.info("Countries", _.groupBy(countries, "type"));
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
    const countriesGeojson = await COUNTRIES_GEOJSON_PROMISE;
    return countriesGeojson;
};

export const getCountryFromName = async (name) => {
    const countries = await getCountries();
    return countries.find((country) => country.name === name);
};
