import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Toast.module.css";

const TOAST_ANIMATION_DURATION_MS = 100;
const TOAST_DURATION_MS = 1000;

const Toast = () => {
    const [toasts, setToasts] = useState({});
    const setToast = useCallback(
        (toastId, toastUpdate) => {
            const toast = toasts[toastId] ?? {};
            const newToast = { ...toast, ...toastUpdate };
            const newToasts = { ...toasts, [toastId]: newToast };
            setToasts(newToasts);
        },
        [toasts],
    );
    const deleteToast = useCallback(
        (toastId) => {
            const newToasts = { ...toasts };
            delete newToasts[toastId];
            setToasts(newToasts);
        },
        [toasts],
    );

    // Initialized newly received toasts
    const externalToasts = useSelector((state) => state.main.toasts);
    useEffect(() => {
        if (externalToasts.length > 0) {
            for (const toast of externalToasts) {
                const toastId = Math.random().toString();
                setToast(toastId, {
                    text: toast.text,
                    hasAppeared: false,
                    isDisappearing: false,
                });
                requestAnimationFrame(() =>
                    setToast(toastId, { hasAppeared: true }),
                );
                setTimeout(
                    () => setToast(toastId, { isDisappearing: true }),
                    TOAST_ANIMATION_DURATION_MS,
                );
                setTimeout(
                    () => deleteToast(toastId),
                    TOAST_ANIMATION_DURATION_MS + TOAST_DURATION_MS,
                );
            }
        }
    }, [deleteToast, externalToasts, setToast]);

    return (
        <div className={styles.container}>
            {Object.entries(toasts).map(([toastId, toast]) => {
                return (
                    <div
                        key={toastId}
                        className={classNames(styles.toast, {
                            [styles.hasAppeared]: toast.hasAppeared,
                            [styles.isDisappearing]: toast.isDisappearing,
                        })}
                    >
                        {toast.content}
                    </div>
                );
            })}
        </div>
    );
};

export default Toast;
