import Papa from "papaparse";
import { getHasStateData } from "../entities/entityData";
import { getCountryFromCode, getStateFromCode } from "./getEntityFromCode";

const ALPHABET = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

const CATEGORIES = {
    INSTITUTIONAL_INFORMATION: "Institutional Information",
    DATASET_INFORMATION: "Dataset Information",
    ACCESSIBILITY: "Accessibility",
};

export const COUNTRY_CODE_COLUMN_NAME = "Country Code";
export const STATE_CODE_COLUMN_NAME = "State Code";

const COUNTRY_CODE_COLUMN = "B";
const COUNTRY_CODE_COLUMN_INDEX = ALPHABET.indexOf(COUNTRY_CODE_COLUMN);
const STATE_CODE_COLUMN = "C";
const STATE_CODE_COLUMN_INDEX = ALPHABET.indexOf(STATE_CODE_COLUMN);

const COLUMNS = [
    // Hidden metadata
    {
        name: "Name of Dataset",
        column: "A",
    },
    {
        name: COUNTRY_CODE_COLUMN_NAME,
        column: COUNTRY_CODE_COLUMN,
    },
    {
        name: STATE_CODE_COLUMN_NAME,
        column: STATE_CODE_COLUMN,
        hide: (value) => !value,
    },

    // Institutional information
    {
        name: "Country",
        column: COUNTRY_CODE_COLUMN,
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: async (countryCode) => {
            const country = await getCountryFromCode(countryCode);
            return country?.name ?? null;
        },
    },
    {
        name: "State",
        columns: [COUNTRY_CODE_COLUMN, STATE_CODE_COLUMN],
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: async ([countryCode, stateCode]) => {
            const state = await getStateFromCode(countryCode, stateCode);
            return state?.name ?? null;
        },
        hide: (value) => !value,
    },
    {
        name: "Source",
        column: "E",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
    },
    {
        name: "URL",
        column: "F",
        category: CATEGORIES.INSTITUTIONAL_INFORMATION,
        transform: (sourceUrl) => {
            if (!sourceUrl) {
                return null;
            }
            return (
                <a href={sourceUrl} target="_" rel="noreferrer">
                    {sourceUrl}
                </a>
            );
        },
    },

    // Dataset information
    {
        name: "Number of Participants",
        column: "G",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Number of Samples",
        column: "H",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Language",
        column: "L",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Disease Category",
        column: "I",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Diagnoses",
        column: "J",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Speech Task(s)",
        column: "K",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Speaker Details",
        column: "M",
        category: CATEGORIES.DATASET_INFORMATION,
    },
    {
        name: "Demographics",
        column: "N",
        category: CATEGORIES.DATASET_INFORMATION,
    },

    // Accessibility
    {
        name: "Accessibility",
        column: "O",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "Access Instructions",
        column: "P",
        category: CATEGORIES.ACCESSIBILITY,
    },
    {
        name: "License Types",
        column: "Q",
        category: CATEGORIES.ACCESSIBILITY,
    },
];

const processRow = async (rawRow, index) => {
    // Check that country code exists
    const rowNumber = index + 2;
    const rowName = `row ${rowNumber} (${rawRow[0]})`;
    const countryCode = rawRow[COUNTRY_CODE_COLUMN_INDEX];
    if (!countryCode) {
        console.warn(`Skipping ${rowName} due to missing country code.`);
        return null;
    }

    // Check that country code is valid
    const country = getCountryFromCode(countryCode);
    if (country === null) {
        console.warn(
            `Skipping ${rowName} due to unknown country code (${countryCode}).`,
        );
        return null;
    }

    // If country has state data...
    const hasStateData = getHasStateData(countryCode);
    if (hasStateData) {
        // Check that state code exists
        const stateCode = rawRow[STATE_CODE_COLUMN_INDEX];
        if (!stateCode) {
            console.warn(`Skipping ${rowName} due to missing state code.`);
            return null;
        }

        // Check that state code is valid
        const state = getStateFromCode(countryCode, stateCode);
        if (state === null) {
            console.warn(
                `Skipping ${rowName} due to unknown state code (${stateCode}) for country '${countryCode}'.`,
            );
            return null;
        }
    }

    // Format dataset row
    const row = [];
    for (const columnData of COLUMNS) {
        const { name, column, columns, category } = columnData;
        const hide = columnData.hide ?? (() => false);
        const transform = columnData.transform ?? ((x) => x);
        let rawValue;
        if (column) {
            const columnIndex = ALPHABET.findIndex(
                (letter) => letter === column,
            );
            rawValue = rawRow[columnIndex];
        } else if (columns) {
            rawValue = columns.map((column) => {
                const columnIndex = ALPHABET.findIndex(
                    (letter) => letter === column,
                );
                return rawRow[columnIndex];
            });
        } else {
            throw Error("Neither 'column' nor 'columns' defined.");
        }
        const value = await transform(rawValue);
        if (!hide(value)) {
            row.push({ name, value, category, hide });
        }
    }
    return row;
};

const VOICE_DATASETS_PROMISE = (async () => {
    let voiceDatasets = [];
    let voiceDatasetsCsv = [];
    try {
        const res = await fetch(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhVfbSe0_jQBHdqbssbutK2n77y0KyB5Th2E70C3whkSoxMFnuBfkD7xjnHU1VIA/pub?gid=1792955439&single=true&output=csv",
        );
        const csvText = await res.text();
        const { data } = Papa.parse(csvText);
        voiceDatasetsCsv = data.slice(1);
    } catch (error) {
        alert("Error loading datasets CSV.");
        console.error(error);
    }
    console.log("voiceDatasetsCsv", voiceDatasetsCsv);
    for (let i = 0; i < voiceDatasetsCsv.length; i++) {
        const rawRow = voiceDatasetsCsv[i];
        const row = await processRow(rawRow, i);
        if (row !== null) {
            voiceDatasets.push(row);
        }
    }
    return voiceDatasets;
})();

export const getVoiceDatasets = async () => {
    const voiceDatasets = await VOICE_DATASETS_PROMISE;
    return voiceDatasets;
};
