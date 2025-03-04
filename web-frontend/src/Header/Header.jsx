import { FaBars } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import mainSlice from "../mainSlice";
import styles from "./Header.module.css";

const Header = () => {
    const dispatch = useDispatch();
    const onClickMenu = () => {
        dispatch(mainSlice.actions.setIsSideMenuOpen(true));
    };
    return (
        <div className={styles.container}>
            <FaBars className={styles.menuButton} onClick={onClickMenu} />
            <div className={styles.title}>
                <div className={styles.titleStart}>Blundle</div>
                <div className={styles.titleEnd}>Countries</div>
            </div>
        </div>
    );
};

export default Header;
