import { useEffect } from "react";
import { useSelector } from "react-redux";
import { COUNTRY_LABELS_LAYER_ID } from "../constants";
import { useGuessedCountries } from "../countries/useGuessedCountries";
import { useTargetCountry } from "../countries/useTargetCountry";
import Guesses from "../Guesses/Guesses";
import Header from "../Header/Header";
import { useRenderGeoJson } from "../map/map";
import Map from "../map/Map/Map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import SideMenu from "../SideMenu/SideMenu";
import StarsBackground from "../StarsBackground/StarsBackground";
import WinModal from "../WinModal/WinModal";
import styles from "./App.module.css";

const TARGET_COUNTRY_FILL_COLOR = "#26D800";
const INCORRECT_COUNTRY_FILL_COLOR = "#CCCCCC";
const TARGET_COUNTRY_BORDER_COLOR = "#000000";

let hasFlown = false;

const App = () => {
    const targetCountry = useTargetCountry();

    // Fly to country on load
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    const flyToCountry = useFlyToCountry();
    useEffect(() => {
        if (isMapInitialized) {
            if (targetCountry !== null && !hasFlown) {
                hasFlown = true;
                flyToCountry(targetCountry);
            }
        }
    }, [targetCountry, flyToCountry, isMapInitialized]);

    // Highlight today's country
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (targetCountry) {
            return renderGeoJson(
                targetCountry.geojson,
                {
                    fillColor: TARGET_COUNTRY_FILL_COLOR,
                    fillOpacity: 0.3,
                    strokeColor: TARGET_COUNTRY_BORDER_COLOR,
                    strokeOpacity: 1,
                    strokeWidth: 2,
                },
                COUNTRY_LABELS_LAYER_ID,
            );
        }
    }, [targetCountry, renderGeoJson]);

    // Highlight guessed countries
    const guessedCountries = useGuessedCountries();
    useEffect(() => {
        const eraseFns = guessedCountries
            .filter((country) => {
                return country.name !== targetCountry.name;
            })
            .map((country) => {
                return renderGeoJson(
                    country.geojson,
                    {
                        fillColor: INCORRECT_COUNTRY_FILL_COLOR,
                        fillOpacity: 0.5,
                        strokeColor: TARGET_COUNTRY_BORDER_COLOR,
                        strokeOpacity: 1,
                        strokeWidth: 2,
                    },
                    COUNTRY_LABELS_LAYER_ID,
                );
            });
        return () => eraseFns.forEach((eraseFn) => eraseFn());
    }, [targetCountry, guessedCountries, renderGeoJson]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header />
                <Map />
                <Guesses />
            </div>
            <StarsBackground />
            <SideMenu />
            <WinModal />
        </div>
    );
};

export default App;
