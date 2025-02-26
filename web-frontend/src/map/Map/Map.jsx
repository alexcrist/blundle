import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAP_CONTAINER_ID } from "../../constants";
import { useShowReturnButton } from "../../useShowReturnButton";
import { useInitMap, useMapResize } from "../map";
import styles from "./Map.module.css";
import "./maplibre.css";

const Map = () => {
    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);
    const isMapInitialized = useSelector(
        (state) => state.main.isMapInitialized,
    );

    // 'Return to country' button
    const [showReturnButton, onClickReturnButton] = useShowReturnButton();

    // Calculate map height
    const ref = useRef();
    const mapResize = useMapResize();
    const [mapHeightPx, setMapHeightPx] = useState(window.innerHeight / 2);
    const updateMapHeight = useCallback(() => {
        if (ref.current) {
            const dims = ref.current.getBoundingClientRect();
            setMapHeightPx(dims.height);
            mapResize();
        }
    }, [mapResize]);
    useEffect(() => {
        if (ref.current) {
            updateMapHeight();
            const onResize = _.debounce(updateMapHeight, 75, {
                maxWait: 300,
                leading: false,
                trailing: true,
            });
            const resizeObserver = new ResizeObserver(onResize);
            resizeObserver.observe(ref.current);
            return () => resizeObserver.disconnect();
        }
    }, [updateMapHeight]);

    return (
        <div className={styles.container} ref={ref}>
            <button
                className={classNames(styles.returnToCountryButton, {
                    [styles.isVisible]: showReturnButton,
                })}
                onClick={onClickReturnButton}
            >
                Return to country
            </button>
            <div
                id={MAP_CONTAINER_ID}
                className={classNames(styles.map, {
                    [styles.isVisible]: isMapInitialized,
                })}
                style={{ height: `${mapHeightPx}px` }}
            />
        </div>
    );
};

export default Map;
