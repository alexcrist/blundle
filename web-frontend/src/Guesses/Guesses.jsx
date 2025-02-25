import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MAX_GUESSES } from "../constants";
import { getCountryData } from "../countries/getCountry";
import styles from "./Guesses.module.css";

const Guesses = () => {
    // Submittable options
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        (async () => {
            const countries = await getCountryData();
            setCountries(countries);
        })();
    }, []);

    const [inputValue, setInputValue] = useState("");

    const guesses = useSelector((state) => state.main.guesses);

    const isInputValid = useMemo(() => {
        return false;
    }, []);

    const onClickSubmit = () => {
        const isValid = false;
    };
    const isInputDisabled = useMemo(() => {
        // if max guesses used, if user gave up, or if they got it right
        return false;
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.title}>
                    Guess the highlighted country
                </div>
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
                </div>
                {_.range(MAX_GUESSES).map((index) => {
                    return (
                        <div className={styles.guess} key={`guess-${index}`}>
                            {index + 1}. {guesses[index] ?? ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Guesses;
