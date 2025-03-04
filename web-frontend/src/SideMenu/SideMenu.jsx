import { useCallback } from "react";
import { FaDatabase, FaEnvelope, FaGithub, FaMugSaucer } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import mainSlice from "../mainSlice";
import styles from "./SideMenu.module.css";

const SideMenu = () => {
    const dispatch = useDispatch();
    const isVisible = useSelector((state) => state.main.isSideMenuOpen);
    const onClickBackground = useCallback(() => {
        dispatch(mainSlice.actions.setIsSideMenuOpen(false));
    }, [dispatch]);
    const setIsNotVisible = useCallback(() => {
        dispatch(mainSlice.actions.setIsSideMenuOpen(false));
    }, [dispatch]);
    return (
        <Modal
            isVisible={isVisible}
            setIsNotVisible={setIsNotVisible}
            onClickBackground={onClickBackground}
            backgroundClassName={styles.modalBackground}
            visibleClassName={styles.modalVisible}
            className={styles.modal}
        >
            <div className={styles.title}>
                Blundle{"\n"}
                Countries
            </div>
            <div className={styles.item}>
                <a
                    href="https://forms.gle/6GWV2UB2CWFGV83w5"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaEnvelope size={14} className={styles.icon} />
                    Give feedback
                </a>
            </div>
            <div className={styles.item}>
                <a
                    href="https://github.com/alexcrist/blundle"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaGithub size={14} className={styles.icon} />
                    See the code
                </a>
            </div>
            <div className={styles.item}>
                <a
                    href="https://www.naturalearthdata.com/downloads/10m-cultural-vectors/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaDatabase size={14} className={styles.icon} />
                    Country dataset
                </a>
            </div>
            <div className={styles.item}>
                <a
                    href="https://buymeacoffee.com/alexcrist"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaMugSaucer size={14} className={styles.icon} />
                    Buy me a coffee
                </a>
            </div>
        </Modal>
    );
};

export default SideMenu;
