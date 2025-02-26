import { useCallback, useEffect, useState } from "react";
import { useCountryOfTheDay } from "./countries/useCountryOfTheDay";
import { getMap, useAddMapEventListener } from "./map/map";
import { useFlyToCountry } from "./map/useFlyToCountry";

const MAX_CENTRAL_ANGLE_DEG = 40;
const RETURN_BUTTON_COOLDOWN_MS = 1000;

let lastClicked = Date.now();

export const useShowReturnButton = () => {
    const addMapEventListener = useAddMapEventListener();
    const countryOfTheDay = useCountryOfTheDay();
    const [showReturnButton, setShowReturnButton] = useState(false);
    useEffect(() => {
        return addMapEventListener("moveend", () => {
            if (Date.now() - lastClicked < RETURN_BUTTON_COOLDOWN_MS) {
                return;
            }
            const isCountryInBounds = getIsCountryInBounds(countryOfTheDay);
            const centralAngleDeg = getCentralAngleDeg(countryOfTheDay);
            const showReturnButton =
                !isCountryInBounds || centralAngleDeg > MAX_CENTRAL_ANGLE_DEG;
            setShowReturnButton(showReturnButton);
        });
    }, [addMapEventListener, countryOfTheDay]);
    const flyToCountry = useFlyToCountry();
    const onClickReturnButton = useCallback(() => {
        setShowReturnButton(false);
        lastClicked = Date.now();
        flyToCountry(countryOfTheDay);
    }, [countryOfTheDay, flyToCountry]);
    return [showReturnButton, onClickReturnButton];
};

const getIsCountryInBounds = (country) => {
    if (!country) {
        return false;
    }
    const [lon, lat] = country.coordLonLat;
    const bounds = getMap().getBounds();
    const minLon = bounds.getWest();
    const maxLon = bounds.getEast();
    const minLat = bounds.getSouth();
    const maxLat = bounds.getNorth();

    // Must be within lat bounds
    if (lat < minLat || lat > maxLat) {
        return false;
    }

    // Normal case: bbox does not cross international date line
    if (minLon <= maxLon) {
        return lon >= minLon && lon <= maxLon;
    }

    // Edge case: bbox crosses international date line (minLon > maxLon)
    else {
        return lon >= minLon || lon <= maxLon;
    }
};

// Returns the 'central angle' between the center of the map view port and the
// center of the given country
const getCentralAngleDeg = (country) => {
    const lon1 = getMap().getCenter().lng;
    const lat1 = getMap().getCenter().lat;
    const [lon2, lat2] = country.coordLonLat;
    const toRadians = (deg) => deg * (Math.PI / 180);
    const toDegrees = (rad) => rad * (180 / Math.PI);
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const λ1 = toRadians(lon1);
    const λ2 = toRadians(lon2);
    const deltaLambda = λ2 - λ1;
    const angleRad = Math.acos(
        Math.sin(φ1) * Math.sin(φ2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.cos(deltaLambda),
    );
    return toDegrees(angleRad);
};
