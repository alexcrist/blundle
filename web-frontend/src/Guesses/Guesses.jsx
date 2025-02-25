import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { MAX_GUESSES } from "../constants";
import { getCountryData } from "../countries/getCountry";
import { useCountryOfTheDay } from "../countries/useCountryOfTheDay";
import { useGuessedCountries } from "../countries/useGuessedCountries";
import mainSlice from "../mainSlice";
import { useSetMapLayoutProperty } from "../map/map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import { winAnimation } from "../winAnimation";
import styles from "./Guesses.module.css";

const NUM_SUGGESTIONS = 3;

const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/gi, "");

const Guesses = () => {
    // User input
    const [inputValue, setInputValue] = useState("");
    const cleanInput = useMemo(() => sanitize(inputValue), [inputValue]);

    // Get guessed countries
    const guessedCountries = useGuessedCountries();

    // Get country of the day
    const countryOfTheDay = useCountryOfTheDay();

    // Load countries
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        (async () => {
            const cleanNames = {};
            const countries = (await getCountryData()).map((country) => {
                const cleanName = sanitize(country.name);
                if (cleanNames[cleanName]) {
                    const message = `Error: two countries share the name when sanitized: ${cleanName}`;
                    alert(message);
                    throw Error(message);
                }
                cleanNames[cleanName] = true;
                return { ...country, cleanName };
            });
            setCountries(countries);
        })();
    }, []);

    // Get guessable countries
    const guessableCountries = useMemo(() => {
        const guessedCountryMap = {};
        guessedCountries.forEach(
            (country) => (guessedCountryMap[country.name] = true),
        );
        return countries.filter((country) => {
            const isGuessed = guessedCountryMap[country.name];
            return !isGuessed;
        });
    }, [countries, guessedCountries]);

    // Validate user input
    const isInputValid = useMemo(() => {
        for (const country of guessableCountries) {
            if (cleanInput === country.cleanName) {
                return true;
            }
        }
        return false;
    }, [cleanInput, guessableCountries]);

    // Suggestions
    const suggestions = useMemo(() => {
        if (inputValue.length < 2) {
            return [];
        }
        return guessableCountries
            .filter((country) => {
                return (
                    country.cleanName.includes(cleanInput) &&
                    country.name !== inputValue
                );
            })
            .filter((__, index) => {
                return index < NUM_SUGGESTIONS;
            });
    }, [cleanInput, guessableCountries, inputValue]);

    // Determine win / loss
    const didWin = useMemo(() => {
        for (const country of guessedCountries) {
            if (
                countryOfTheDay?.name &&
                countryOfTheDay.name === country.name
            ) {
                return true;
            }
        }
        return false;
    }, [countryOfTheDay, guessedCountries]);
    const didLose = useMemo(() => {
        return !didWin && guessedCountries.length === MAX_GUESSES;
    }, [didWin, guessedCountries]);
    const isGameOver = useMemo(() => didWin || didLose, [didLose, didWin]);

    // Show country labels if game is over
    const setMapLayoutProperty = useSetMapLayoutProperty();
    useEffect(() => {
        const visibility = isGameOver ? "visible" : "none";
        setMapLayoutProperty("countries-label", "visibility", visibility);
    }, [isGameOver, setMapLayoutProperty]);

    // Handle guess submission
    const dispatch = useDispatch();
    const flyToCountry = useFlyToCountry();
    const onClickSubmit = useCallback(() => {
        if (!isInputValid) {
            return;
        }
        const country = countries.find(
            (country) => country.cleanName === cleanInput,
        );
        if (!country) {
            const message = `Could not find country "${cleanInput}"`;
            alert(message);
            throw Error(message);
        }
        setInputValue("");
        dispatch(mainSlice.actions.addGuessedCountryName(country.name));
        const isCorrect = country.name === countryOfTheDay.name;
        if (isCorrect) {
            winAnimation();
        } else {
            flyToCountry(country);
        }
    }, [
        cleanInput,
        countries,
        countryOfTheDay,
        dispatch,
        flyToCountry,
        isInputValid,
    ]);

    // Determine if guessing is disabled
    const isInputDisabled = useMemo(() => isGameOver, [isGameOver]);

    // Get title text
    const titleText = useMemo(() => {
        if (didWin && guessedCountries.length === 1) {
            return `Wow! First try! ${countryOfTheDay?.name} is correct!`;
        }
        if (didWin && guessedCountries.length > 1) {
            return `That's correct, you win! The answer was ${countryOfTheDay?.name}!`;
        }
        if (didLose) {
            return `Nice try! The answer was ${countryOfTheDay?.name}!`;
        }
        return "Guess the highlighted country";
    }, [countryOfTheDay?.name, didLose, didWin, guessedCountries.length]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.title}>{titleText}</div>
                <div className={styles.inputContainer}>
                    <input
                        disabled={isInputDisabled}
                        className={styles.input}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    <button
                        className={styles.button}
                        disabled={isInputDisabled || !isInputValid}
                        onClick={onClickSubmit}
                    >
                        Submit
                    </button>
                    <div className={styles.suggestions}>
                        {suggestions.map((country) => {
                            const onClick = () => setInputValue(country.name);
                            return (
                                <div
                                    onClick={onClick}
                                    key={country.cleanName}
                                    className={styles.suggestion}
                                >
                                    {country.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {_.range(MAX_GUESSES).map((index) => {
                    const isCorrect =
                        countryOfTheDay?.name &&
                        countryOfTheDay?.name === guessedCountries[index]?.name;
                    return (
                        <div
                            className={classNames(styles.guess, {
                                [styles.isCorrect]: isCorrect,
                            })}
                            key={`guess-${index}`}
                        >
                            {index + 1}. {guessedCountries[index]?.name ?? ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Guesses;
