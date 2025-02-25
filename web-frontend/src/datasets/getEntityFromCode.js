import {
    getCountryData,
    getHasStateData,
    STATE_DATA_PROMISES,
} from "../entities/entityData";

const COUNTRY_CODE_MAP_PROMISE = (async () => {
    const map = {};
    const countryData = await getCountryData();
    countryData.forEach((country) => {
        map[country.codeIso3] = country;
    });
    return map;
})();

const STATE_CODE_MAP_PROMISES = (async () => {
    const maps = {};
    for (const [countryCode, stateDataPromise] of Object.entries(
        STATE_DATA_PROMISES,
    )) {
        const stateData = (await stateDataPromise).default;
        maps[countryCode] = {};
        stateData.forEach((state) => {
            maps[countryCode][state.stateCode] = state;
        });
    }
    return maps;
})();

export const getCountryFromCode = async (countryCode) => {
    const countryCodeMap = await COUNTRY_CODE_MAP_PROMISE;
    return countryCodeMap[countryCode] ?? null;
};

export const getStateFromCode = async (countryCode, stateCode) => {
    const hasStateData = getHasStateData(countryCode);
    if (!hasStateData) {
        return null;
    }
    const stateCodeMaps = await STATE_CODE_MAP_PROMISES;
    return stateCodeMaps[countryCode][stateCode] ?? null;
};
