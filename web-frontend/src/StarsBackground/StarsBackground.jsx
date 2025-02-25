import _ from "lodash";
import { useMemo } from "react";
import styles from "./StarsBackground.module.css";

const StarsBackground = () => {
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
        <div className={styles.container}>
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
    );
};

export default StarsBackground;
