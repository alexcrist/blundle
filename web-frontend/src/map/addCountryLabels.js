import { COUNTRY_LABELS_LAYER_ID } from "../constants";
import { getCountries } from "../countries/getCountry";

const ZOOM_TO_TEXT_SIZES = [
    [1, 1],
    [10, 40],
    [20, 400],
].reduce((flatList, [zoom, textSize]) => {
    return [...flatList, Number(zoom), Number(textSize)];
}, []);

export const addCountryLabelsLayer = async (map) => {
    const countries = await getCountries();
    map.addLayer({
        id: COUNTRY_LABELS_LAYER_ID,
        type: "symbol",
        source: {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: countries.map((country) => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [country.nameLon, country.nameLat],
                        },
                        properties: {
                            name: country.name,
                            endonym: "\n" + (country.endonyms[0] ?? ""),
                        },
                    };
                }),
            },
        },
        layout: {
            visibility: "none",
            "text-field": [
                "format",
                ["get", "name"],
                {
                    "font-scale": 1,
                    "text-opacity": 1,
                },
                " ",
                {},
                ["get", "endonym"],
                {
                    "font-scale": 0.7,
                    "text-opacity": 0.7,
                },
            ],

            "text-size": [
                "interpolate",
                ["exponential", 1.1],
                ["zoom"],
                ...ZOOM_TO_TEXT_SIZES,
            ],
            "text-font": ["NotoSansRegular"],
            "symbol-placement": "point",
            "text-allow-overlap": true,
        },
        paint: {
            "text-color": "#000000",
            "text-halo-color": "#FFFFFF",
            "text-halo-width": 2,
            "text-halo-blur": 1,
            "text-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1,
                0, // Transparent at zoom 1.5
                2,
                1, // Opaque isible at zoom 3
            ],
        },
    });
};
