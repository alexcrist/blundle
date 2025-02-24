import _ from "lodash";
import { useEffect, useMemo } from "react";
import { MAP_CONTAINER_ID } from "../../constants";
import { useInitMap } from "../map";
import styles from "./Map.module.css";

const Map = () => {
    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);

    const stars = useMemo(() => {
        return _.range(1000).map(() => {
            return {
                x: Math.random() * 100,
                y: Math.random() * 100,
                blur: Math.random() ** 2 * 5,
                size: Math.random() * 3,
            };
        });
    }, []);

    return (
        <div className={styles.container} id={MAP_CONTAINER_ID}>
            <div className={styles.stars}>
                {stars.map((star, index) => {
                    return (
                        <div
                            className={styles.star}
                            key={`star-${index}`}
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: star.size,
                                height: star.size,
                                filter: `blur(${star.blur}px)`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Map;
