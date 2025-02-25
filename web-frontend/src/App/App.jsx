import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCountry } from "../countries/useCountry";
import Guesses from "../Guesses/Guesses";
import { useRenderGeoJson } from "../map/map";
import Map from "../map/Map/Map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import StarsBackground from "../StarsBackground/StarsBackground";
import styles from "./App.module.css";

let hasFlown = false;

const App = () => {
    const country = useCountry();

    // Fly to country on load
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    const flyToCountry = useFlyToCountry();
    useEffect(() => {
        if (isMapInitialized) {
            if (country !== null && !hasFlown) {
                hasFlown = true;
                flyToCountry(country);
            }
        }
    }, [country, flyToCountry, isMapInitialized]);

    // Highlight country
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (country) {
            return renderGeoJson(country.geojson, {
                fillColor: "#F1F54D",
                fillOpacity: 0.5,
                strokeColor: "#000000",
                strokeOpacity: 1,
                strokeWidth: 3.5,
            });
        }
    }, [country, renderGeoJson]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Map />
                <Guesses />
            </div>
            <StarsBackground />
        </div>
    );
};

export default App;
