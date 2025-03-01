import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getCountries } from "../countries/getCountry";
import { useGuessedCountries } from "../countries/useGuessedCountries";
import { useTargetCountry } from "../countries/useTargetCountry";
import mainSlice from "../mainSlice";
import { useSetMapLayoutProperty } from "../map/map";
import { useFlyToCountry } from "../map/useFlyToCountry";
import styles from "./Guesses.module.css";

const NUM_SUGGESTIONS = 3;
const MAX_GUESSES = 3;

const TRY_AGAIN_MESSAGES = _.shuffle([
    "Not quite, but you're getting there!",
    "Close, but no cigar. Try again!",
    "Almost! You're on the right track.",
    "Not that one, but I admire the confidence.",
    "You're thinking globally, but not quite correctly.",
    "Nope, but I like where your head's at.",
    "That’s a bold guess! Give it another go!",
    "You’re circling the right area. Try again!",
    "Not this time, but your world knowledge is expanding.",
    "A good effort! But let’s take another shot.",
    "You’ve got the spirit, now find the right spot!",
    "A solid attempt, but the map says otherwise.",
    "Wrong border, right energy!",
    "You missed it this time, but you’re learning fast.",
    "Not this one, but hey, you’re one guess smarter now.",
    "That’s a respectable miss! Keep going!",
    "You’re exploring, and that’s what counts! Try again.",
    "Geography is tricky, but so are you. Go again!",
    "I see where you’re coming from, but nope!",
    "You’re sharpening your atlas skills, even when you miss!",
    "The world is big, and so is your potential! Guess again!",
    "That guess had style, even if it wasn’t right.",
    "Not quite, but that was a thoughtful choice!",
    "You might be off by a few borders, but keep at it!",
    "You're not lost, just discovering! Try again.",
]);

const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/gi, "");

const Guesses = () => {
    // User input
    const [inputValue, setInputValue] = useState("");
    const cleanInput = useMemo(() => sanitize(inputValue), [inputValue]);

    // Get guessed countries
    const guessedCountries = useGuessedCountries();

    // Get country of the day
    const targetCountry = useTargetCountry();

    // Load countries
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        (async () => {
            const cleanNames = {};
            const countries = (await getCountries()).map((country) => {
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
        if (inputValue.length < 1) {
            return [];
        }
        for (const guessableCountry of guessableCountries) {
            if (guessableCountry.name === inputValue) {
                return [];
            }
        }
        return _(guessableCountries)
            .filter((country) => country.cleanName.includes(cleanInput))
            .sortBy((country) => country.cleanName.indexOf(cleanInput))
            .filter((__, index) => index < NUM_SUGGESTIONS)
            .value();
    }, [cleanInput, guessableCountries, inputValue]);

    // Determine win / loss
    const didWin = useMemo(() => {
        for (const country of guessedCountries) {
            if (targetCountry?.name && targetCountry.name === country.name) {
                return true;
            }
        }
        return false;
    }, [targetCountry, guessedCountries]);
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
        const isCorrect = country.name === targetCountry.name;
        if (isCorrect) {
            dispatch(mainSlice.actions.setIsWinModalVisible(true));
        } else {
            flyToCountry(country);
        }
    }, [
        cleanInput,
        countries,
        targetCountry,
        dispatch,
        flyToCountry,
        isInputValid,
    ]);

    // Determine if guessing is disabled
    const isInputDisabled = useMemo(() => isGameOver, [isGameOver]);

    // Get title text
    const titleText = useMemo(() => {
        if (didWin && guessedCountries.length === 1) {
            return `Wow! First try! ${targetCountry?.name} is correct!`;
        }
        if (didWin && guessedCountries.length > 1) {
            return `That's correct, you win! The answer was ${targetCountry?.name}!`;
        }
        if (didLose) {
            return `Nice try! The answer was ${targetCountry?.name}!`;
        }
        if (guessedCountries.length === 0) {
            return "Guess the highlighted country";
        }
        return TRY_AGAIN_MESSAGES[guessedCountries.length - 1];
    }, [targetCountry?.name, didLose, didWin, guessedCountries.length]);

    // On click play again
    const onClickPlayAgain = () => window.location.reload();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.title}>{titleText}</div>
                {isGameOver ? (
                    <button
                        className={classNames(
                            styles.button,
                            styles.playAgainButton,
                        )}
                        onClick={onClickPlayAgain}
                    >
                        Play again
                    </button>
                ) : (
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
                                const onClick = () => {
                                    setInputValue(country.name);
                                };
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
                )}
                {_.range(MAX_GUESSES).map((index) => {
                    const isCorrect =
                        targetCountry?.name &&
                        targetCountry?.name === guessedCountries[index]?.name;
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
