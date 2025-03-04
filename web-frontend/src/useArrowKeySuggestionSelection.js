import { useEffect, useState } from "react";

export const useArrowKeySuggestionSelection = (
    suggestions,
    setInputValue,
    onClickSubmit,
) => {
    const [hoveredSuggestionIndex, setHoveredSuggestionIndex] = useState(null);

    // Reset hoveredSuggestionIndex when suggestions change
    useEffect(() => {
        setHoveredSuggestionIndex(null);
    }, [suggestions]);

    // Lsten for arrow key / enter key presses
    useEffect(() => {
        const onKeyPress = (event) => {
            const isValidHoveredSuggestionIndex =
                hoveredSuggestionIndex !== null &&
                hoveredSuggestionIndex >= 0 &&
                hoveredSuggestionIndex <= suggestions.length - 1;

            // If user presses enter when hovering a suggestion, choose the suggestion
            if (
                event.key === "Enter" &&
                suggestions.length > 0 &&
                isValidHoveredSuggestionIndex
            ) {
                event.preventDefault();
                const country = suggestions[hoveredSuggestionIndex];
                setInputValue(country.name);
            }

            // If user presses enter after choosing a country name, submit it
            else if (event.key === "Enter" && suggestions.length === 0) {
                event.preventDefault();
                onClickSubmit();
            }

            // If user presses up arrow key, update hovered suggestion index
            else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (isValidHoveredSuggestionIndex) {
                    let newHoveredSuggestionIndex = hoveredSuggestionIndex - 1;
                    if (newHoveredSuggestionIndex < 0) {
                        newHoveredSuggestionIndex = suggestions.length - 1;
                    }
                    setHoveredSuggestionIndex(newHoveredSuggestionIndex);
                } else {
                    const newHoveredSuggestionIndex = suggestions.length - 1;
                    setHoveredSuggestionIndex(newHoveredSuggestionIndex);
                }
            }

            // If user presses down arrow key, update hovered suggestion index
            else if (event.key === "ArrowDown") {
                event.preventDefault();
                if (isValidHoveredSuggestionIndex) {
                    let newHoveredSuggestionIndex = hoveredSuggestionIndex + 1;
                    if (newHoveredSuggestionIndex > suggestions.length - 1) {
                        newHoveredSuggestionIndex = 0;
                    }
                    setHoveredSuggestionIndex(newHoveredSuggestionIndex);
                } else {
                    const newHoveredSuggestionIndex = 0;
                    setHoveredSuggestionIndex(newHoveredSuggestionIndex);
                }
            }
        };
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, [hoveredSuggestionIndex, onClickSubmit, setInputValue, suggestions]);

    return hoveredSuggestionIndex;
};
