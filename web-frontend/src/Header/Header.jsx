import styles from "./Header.module.css";

const Header = () => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <div className={styles.titleStart}>Blundle</div>
                <div className={styles.titleEnd}>Countries</div>
            </div>
        </div>
    );
};

export default Header;
