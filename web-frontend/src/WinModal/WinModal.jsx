import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import { ConfettiBlaster } from "../ConfettiBlaster";
import { useTargetCountry } from "../countries/useTargetCountry";
import mainSlice from "../mainSlice";
import Modal from "../Modal/Modal";
import { useReset } from "../useReset";
import styles from "./WinModal.module.css";

const WinModal = () => {
    const isVisible = useSelector((state) => state.main.isWinModalVisible);
    const dispatch = useDispatch();
    useEffect(() => {}, []);
    const setIsVisible = useCallback(
        (isVisible) =>
            dispatch(mainSlice.actions.setIsWinModalVisible(isVisible)),
        [dispatch],
    );
    const targetCountry = useTargetCountry();

    // Preload dancing earth image
    useEffect(() => {
        new Image().src = "dance.gif";
    }, []);

    // Blast confetti
    const [canvasRef, setCanvasRef] = useState(null);
    const updateCanvasRef = useCallback((node) => setCanvasRef(node), []);
    useEffect(() => {
        if (isVisible && canvasRef) {
            const confettiBlaster = new ConfettiBlaster(canvasRef);
            return () => confettiBlaster.stop();
        }
    }, [canvasRef, isVisible]);

    // Button click handlers
    const onClickClose = () => setIsVisible(false);
    const reset = useReset();

    return (
        <>
            <Modal
                isVisible={isVisible}
                setIsNotVisible={onClickClose}
                className={styles.modal}
                backgroundChildren={
                    <canvas
                        className={styles.confettiCanvas}
                        ref={updateCanvasRef}
                    />
                }
            >
                <div className={styles.content}>
                    <div className={styles.title}>
                        Correct! It&apos;s <b>{targetCountry?.name}</b>!
                    </div>
                    <img src="dance.gif" className={styles.gif} />
                    <div className={styles.buttons}>
                        <Button
                            isSecondary
                            className={styles.button}
                            onClick={onClickClose}
                        >
                            Close
                        </Button>
                        <Button className={styles.button} onClick={reset}>
                            Play again
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default WinModal;
