const COUNTRY_DATA_PROMISE = import("./country-borders.json");

let seed = Math.random() * 999999999;

export const getCountryOfTheDay = async () => {
    const countries = await getCountryData();
    const seed = getSeedForToday();
    const index =
        Math.floor(getRandomNumberWithSeed(seed) * 9999999) % countries.length;
    return countries[index];
};

export const getCountryData = async () => {
    return (await COUNTRY_DATA_PROMISE).default;
};

export const getCountryFromName = async (name) => {
    const countries = await getCountryData();
    return countries.find((country) => country.name === name);
};

const getSeedForToday = () => {
    return seed;
    // TODO
    // const dateString = new Date().toISOString().split("T")[0];
    // return new Date(dateString).getTime();
};

const getRandomNumberWithSeed = (seed) => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
