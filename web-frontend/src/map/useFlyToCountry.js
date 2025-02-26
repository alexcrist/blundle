import { useCallback } from "react";
import { useFlyToBbox, useFlyToPoint } from "./map";

const FLY_TO_POINT_ZOOM = 3;

export const useFlyToCountry = () => {
    const flyToBbox = useFlyToBbox();
    const flyToPoint = useFlyToPoint();
    return useCallback(
        (country) => {
            const minLon = country.bbox[0];
            const maxLon = country.bbox[2];
            const lonDiff = maxLon - minLon;
            if (lonDiff > 180) {
                const [lon, lat] = country.coordLonLat;
                flyToPoint(lon, lat, FLY_TO_POINT_ZOOM);
            } else {
                // Note: flyToBbox has an issue (due to mapLibre map.fitBounds bug
                // under the hood) where giving a paddingOptions will make it think
                // a bbox near the international date line can't be flown too.
                // Therefore, no padding is given here.
                try {
                    flyToBbox(country.bbox);
                } catch (error) {
                    console.warn(error);
                }
            }
        },
        [flyToBbox, flyToPoint],
    );
};
