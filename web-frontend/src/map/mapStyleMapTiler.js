const OCEAN_COLOR = "#99AEF3";

export const MAP_STYLE_MAP_TILER = {
    version: 8,
    id: "9c905444-007b-4433-a8f4-d8a37209bb01",
    name: "Countries",
    sources: {
        maptiler_attribution: {
            attribution:
                '\u003Ca href="https://www.maptiler.com/copyright/" target="_blank"\u003E&copy; MapTiler\u003C/a\u003E \u003Ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003E&copy; OpenStreetMap contributors\u003C/a\u003E',
            type: "vector",
        },
        maptiler_planet: {
            url: "https://api.maptiler.com/tiles/v3/tiles.json?key=BNBf69og6bhE4TsitqJW",
            type: "vector",
        },
    },
    layers: [
        {
            id: "Background",
            type: "background",
            layout: {
                visibility: "visible",
            },
            paint: {
                "background-color": "hsl(91, 54%, 83%)",
            },
        },
        {
            id: "Glacier",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "globallandcover",
            maxzoom: 8,
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-color": "hsl(27, 0%, 100%)",
            },
            filter: ["==", "class", "snow"],
        },
        {
            id: "Forest",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "globallandcover",
            maxzoom: 8,
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-color": [
                    "interpolate",
                    ["exponential", 1],
                    ["zoom"],
                    1,
                    "hsla(120, 58%, 65%, 0.25)",
                    7,
                    "hsla(120, 58%, 65%, 0.6)",
                ],
            },
            filter: ["in", "class", "forest", "tree"],
        },
        {
            id: "Sand",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "landcover",
            minzoom: 8,
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-antialias": false,
                "fill-color": "hsla(83, 87%, 49%, 0.3)",
                "fill-opacity": {
                    stops: [
                        [7, 0.7],
                        [12, 1],
                    ],
                },
            },
            filter: ["==", "class", "sand"],
        },
        {
            id: "Grass",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "landcover",
            minzoom: 8,
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-antialias": false,
                "fill-color": "hsla(118, 58%, 73%, 0.8)",
                "fill-opacity": {
                    stops: [
                        [7, 0.7],
                        [12, 1],
                    ],
                },
            },
            filter: ["==", "class", "grass"],
        },
        {
            id: "Wood",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "landcover",
            minzoom: 8,
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-antialias": false,
                "fill-color": "hsla(120, 58%, 65%, 0.8)",
                "fill-opacity": {
                    stops: [
                        [7, 0.7],
                        [12, 1],
                    ],
                },
            },
            filter: ["==", "class", "wood"],
        },
        {
            id: "Water",
            type: "fill",
            source: "maptiler_planet",
            "source-layer": "water",
            layout: {
                visibility: "visible",
            },
            paint: {
                "fill-color": OCEAN_COLOR,
                "fill-opacity": ["match", ["get", "intermittent"], 1, 0.7, 1],
            },
            filter: ["!=", "brunnel", "tunnel"],
        },
        {
            id: "River",
            type: "line",
            source: "maptiler_planet",
            "source-layer": "waterway",
            layout: {
                visibility: "visible",
            },
            paint: {
                "line-color": "hsl(236, 66%, 73%)",
                "line-opacity": ["match", ["get", "brunnel"], "tunnel", 0.7, 1],
                "line-width": {
                    stops: [
                        [9, 1],
                        [18, 3],
                    ],
                },
            },
            filter: ["!=", "intermittent", 1],
        },
        {
            id: "River intermittent",
            type: "line",
            source: "maptiler_planet",
            "source-layer": "waterway",
            layout: {
                visibility: "visible",
            },
            paint: {
                "line-color": "hsl(236, 66%, 73%)",
                "line-dasharray": [2, 1],
                "line-opacity": 1,
                "line-width": {
                    stops: [
                        [9, 1],
                        [18, 3],
                    ],
                },
            },
            filter: ["==", "intermittent", 1],
        },
        {
            id: "Disputed border",
            type: "line",
            source: "maptiler_planet",
            "source-layer": "boundary",
            minzoom: 0,
            layout: {
                "line-cap": "round",
                "line-join": "round",
                visibility: "visible",
            },
            paint: {
                "line-color": "hsl(31, 22%, 64%)",
                "line-dasharray": [2, 2],
                "line-width": {
                    stops: [
                        [1, 1],
                        [5, 1.5],
                        [10, 2],
                    ],
                },
            },
            filter: [
                "all",
                ["==", "admin_level", 2],
                ["==", "maritime", 0],
                ["==", "disputed", 1],
            ],
        },
        {
            id: "Country border",
            type: "line",
            source: "maptiler_planet",
            "source-layer": "boundary",
            minzoom: 0,
            layout: {
                "line-cap": "round",
                "line-join": "round",
                visibility: "visible",
            },
            paint: {
                "line-blur": {
                    stops: [
                        [4, 0.5],
                        [10, 0],
                    ],
                },
                "line-color": "hsl(31, 22%, 64%)",
                "line-width": {
                    stops: [
                        [1, 1],
                        [5, 1.5],
                        [10, 2],
                    ],
                },
            },
            filter: [
                "all",
                ["==", "admin_level", 2],
                ["==", "disputed", 0],
                ["==", "maritime", 0],
            ],
        },
        {
            id: "countries-label",
            type: "symbol",
            source: "maptiler_planet",
            "source-layer": "place",
            minzoom: 1,
            maxzoom: 12,
            layout: {
                "symbol-sort-key": ["to-number", ["get", "rank"]],
                "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
                "text-font": ["Source Sans Pro Regular", "Noto Sans Regular"],
                "text-max-width": 8,
                "text-padding": {
                    stops: [
                        [1, 0],
                        [4, 2],
                    ],
                },
                "text-size": [
                    "interpolate",
                    ["linear", 1],
                    ["zoom"],
                    0,
                    8,
                    1,
                    10,
                    4,
                    ["case", ["\u003E", ["get", "rank"], 2], 13, 15],
                    8,
                    ["case", ["\u003E", ["get", "rank"], 2], 18, 22],
                ],
                visibility: "none",
            },
            paint: {
                "text-color": "hsl(31, 22%, 13%)",
                "text-halo-blur": 1,
                "text-halo-color": "hsla(31, 22%, 100%, 0.75)",
                "text-halo-width": 2,
            },
            filter: ["all", ["==", "class", "country"], ["!=", "iso_a2", "VA"]],
        },
    ],
    glyphs: "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=BNBf69og6bhE4TsitqJW",
    sprite: "https://api.maptiler.com/maps/9c905444-007b-4433-a8f4-d8a37209bb01/sprite",
    bearing: 0,
    pitch: 0,
    center: [0, 0],
    zoom: 1,
    projection: {
        type: "globe",
    },
};
