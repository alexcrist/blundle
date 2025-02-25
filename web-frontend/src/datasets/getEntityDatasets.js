import _ from "lodash";
import {
    COUNTRY_CODE_COLUMN_NAME,
    getVoiceDatasets,
    STATE_CODE_COLUMN_NAME,
} from "./getVoiceDatasets";

const COUNTRY_TO_DATASETS_MAP_PROMISE = (async () => {
    const voiceDatasets = await getVoiceDatasets();
    const countryToDatasetsMap = {};
    for (const row of voiceDatasets) {
        const countryCodeColumn = _.find(row, {
            name: COUNTRY_CODE_COLUMN_NAME,
        });
        const countryCode = countryCodeColumn.value;
        countryToDatasetsMap[countryCode] ??= [];
        countryToDatasetsMap[countryCode].push(row);
    }
    return countryToDatasetsMap;
})();

const STATE_TO_DATASETS_MAP_PROMISE = (async () => {
    const voiceDatasets = await getVoiceDatasets();
    const stateToDatasetsMap = {};
    for (const row of voiceDatasets) {
        const countryCodeColumn = _.find(row, {
            name: COUNTRY_CODE_COLUMN_NAME,
        });
        const countryCode = countryCodeColumn.value;
        const stateCodeColumn = row.find(
            (column) => column.name === STATE_CODE_COLUMN_NAME,
        );
        if (!stateCodeColumn) {
            continue;
        }
        const stateCode = stateCodeColumn.value;
        stateToDatasetsMap[countryCode] ??= {};
        stateToDatasetsMap[countryCode][stateCode] ??= [];
        stateToDatasetsMap[countryCode][stateCode].push(row);
    }
    return stateToDatasetsMap;
})();

// Country datasets ====================================================================

export const getCountryToDatasetsMap = async () => {
    const countryToDatasetsMap = await COUNTRY_TO_DATASETS_MAP_PROMISE;
    return countryToDatasetsMap;
};

export const getCountryToNumDatasetsMap = async () => {
    const countryToDatasetsMap = await getCountryToDatasetsMap();
    const countryToNumDatasetsMap = {};
    for (const countryCode in countryToDatasetsMap) {
        const numDatasets = countryToDatasetsMap[countryCode].length;
        countryToNumDatasetsMap[countryCode] = numDatasets;
    }
    return countryToNumDatasetsMap;
};

export const getCountryDatasets = async (countryCode) => {
    const countryToDatasetsMap = await getCountryToDatasetsMap();
    return countryToDatasetsMap[countryCode] ?? [];
};

export const getCountryNumDatasets = async (countryCode) => {
    const datasets = await getCountryDatasets(countryCode);
    return datasets.length;
};

export const getCountryMaxNumDatasets = async () => {
    const countryToNumDatasetsMap = await getCountryToNumDatasetsMap();
    return _(countryToNumDatasetsMap).values().maxBy();
};

// State datasets ====================================================================

export const getStateToDatasetsMap = async (countryCode) => {
    const stateToDatasetsMap = await STATE_TO_DATASETS_MAP_PROMISE;
    return stateToDatasetsMap[countryCode] ?? {};
};

export const getStateToNumDatasetsMap = async (countryCode) => {
    const stateToDatasetsMap = await getStateToDatasetsMap(countryCode);
    const stateToNumDatasetsMap = {};
    for (const stateCode in stateToDatasetsMap) {
        const numDatasets = stateToDatasetsMap[stateCode].length;
        stateToNumDatasetsMap[stateCode] = numDatasets;
    }
    return stateToNumDatasetsMap;
};

export const getStateDatasets = async (countryCode, stateCode) => {
    const stateToDatasetsMap = await getStateToDatasetsMap(countryCode);
    const stateDatasets = stateToDatasetsMap[stateCode] ?? [];
    return stateDatasets;
};

export const getStateNumDatasets = async (countryCode, stateCode) => {
    const stateDatasets = await getStateDatasets(countryCode, stateCode);
    return stateDatasets.length;
};

export const getStateMaxNumDatasets = async (countryCode) => {
    const stateToNumDatasetsMap = await getStateToNumDatasetsMap(countryCode);
    return _(stateToNumDatasetsMap).values().maxBy();
};
