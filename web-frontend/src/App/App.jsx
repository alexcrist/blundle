import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCountryOfTheDay } from "../countries/useCountryOfTheDay";
import { useGuessedCountries } from "../countries/useGuessedCountries";
import Guesses from "../Guesses/Guesses";
import Header from "../Header/Header";
import { useRenderGeoJson } from "../map/map";
import Map from "../map/Map/Map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import StarsBackground from "../StarsBackground/StarsBackground";
import styles from "./App.module.css";

const COUNTRY_OF_DAY_COLOR = "#98FE5B";
const INCORRECT_GUESS_COLOR = "#CCCCCC";

let hasFlown = false;

const App = () => {
    const countryOfTheDay = useCountryOfTheDay();

    // Fly to country on load
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );
    const flyToCountry = useFlyToCountry();
    useEffect(() => {
        if (isMapInitialized) {
            if (countryOfTheDay !== null && !hasFlown) {
                hasFlown = true;
                flyToCountry(countryOfTheDay);
            }
        }
    }, [countryOfTheDay, flyToCountry, isMapInitialized]);

    // Highlight today's country
    const renderGeoJson = useRenderGeoJson();
    useEffect(() => {
        if (countryOfTheDay) {
            return renderGeoJson(countryOfTheDay.geojson, {
                fillColor: COUNTRY_OF_DAY_COLOR,
                fillOpacity: 0.5,
                strokeColor: "#000000",
                strokeOpacity: 1,
                strokeWidth: 3.5,
            });
        }
    }, [countryOfTheDay, renderGeoJson]);

    // Highlight guessed countries
    const guessedCountries = useGuessedCountries();
    useEffect(() => {
        const eraseFns = guessedCountries
            .filter((country) => {
                return country.name !== countryOfTheDay.name;
            })
            .map((country) => {
                return renderGeoJson(country.geojson, {
                    fillColor: INCORRECT_GUESS_COLOR,
                    fillOpacity: 0.5,
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWidth: 3.5,
                });
            });
        return () => eraseFns.forEach((eraseFn) => eraseFn());
    }, [countryOfTheDay, guessedCountries, renderGeoJson]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header />
                <Map />
                <Guesses />
            </div>
            <StarsBackground />
        </div>
    );
};

export default App;
