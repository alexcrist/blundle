import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import styles from "./Modal.module.css";

const TRANSITION_TIME_MS = 500;

const Modal = ({
    children,
    isVisible,
    setIsNotVisible,
    className,
    backgroundClassName,
    visibleClassName,
    backgroundChildren,
}) => {
    // Fade modal in and out
    const [isShowing, setIsShowing] = useState(false);
    const [hasVisibleClass, setHasVisibleClass] = useState(false);
    useEffect(() => {
        if (isVisible && !isShowing) {
            setIsShowing(true);
        }
    }, [isShowing, isVisible]);
    useEffect(() => {
        if (isVisible && isShowing) {
            requestAnimationFrame(() => {
                setHasVisibleClass(true);
            });
        }
    }, [isShowing, isVisible]);
    useEffect(() => {
        if (!isVisible && isShowing) {
            setHasVisibleClass(false);
            setTimeout(() => setIsShowing(false), TRANSITION_TIME_MS);
        }
    }, [isShowing, isVisible]);

    // Hide modal upon clicking background
    const onClickBackground = useCallback(() => {
        setIsNotVisible();
    }, [setIsNotVisible]);

    if (!isShowing) {
        return null;
    }
    return (
        <div
            className={classNames(
                styles.container,
                styles.backgroundClassName,
                {
                    [classNames(styles.visible, visibleClassName)]:
                        hasVisibleClass,
                },
            )}
            style={{ transition: `all ${TRANSITION_TIME_MS}ms` }}
        >
            {backgroundChildren ?? null}
            <div className={styles.background} onClick={onClickBackground} />
            <div
                className={classNames(styles.content, className)}
                style={{ transition: `all ${TRANSITION_TIME_MS}ms` }}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
