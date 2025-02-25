import classNames from "classnames";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../../constants";
import { useCountryOfTheDay } from "../../countries/useCountryOfTheDay";
import { useShowReturnButton } from "../../useShowReturnButton";
import { useInitMap, useSetMapSize } from "../map";
import { useFlyToCountry } from "../useFlyToCountry";
import styles from "./Map.module.css";
import "./maplibre.css";

const Map = () => {
    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );

    // Resize map (doesn't fully work)
    const setMapSize = useSetMapSize();
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const onLayoutChange = useCallback(() => {
        if (ref) {
            const box = ref.current.getBoundingClientRect();
            setWidth(box.width);
            setHeight(box.height);
            setMapSize(box.width, box.height);
        }
    }, [setMapSize]);
    useLayoutEffect(() => {
        onLayoutChange();
    }, [onLayoutChange]);
    useEffect(() => {
        const onResize = (event) => {
            event.stopImmediatePropagation();
            onLayoutChange();
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [onLayoutChange]);

    // 'Return to country' button
    const showReturnButton = useShowReturnButton();
    const flyToCountry = useFlyToCountry();
    const countryOfTheDay = useCountryOfTheDay();
    const onClickReturnToCountry = () => {
        flyToCountry(countryOfTheDay);
    };

    return (
        <div className={styles.container} ref={ref}>
            <button
                className={classNames(styles.returnToCountryButton, {
                    [styles.isVisible]: showReturnButton,
                })}
                onClick={onClickReturnToCountry}
            >
                Return to country
            </button>
            <div
                id={MAP_CONTAINER_ID}
                className={styles.map}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    opacity: isMapInitialized ? 1 : 0,
                }}
            />
        </div>
    );
};

export default Map;
