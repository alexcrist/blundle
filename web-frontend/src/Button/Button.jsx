import classNames from "classnames";
import styles from "./Button.module.css";

const Button = ({
    onClick: rawOnClick,
    className,
    isDisabled,
    isSecondary,
    children,
}) => {
    const onClick = () => {
        if (!isDisabled) {
            rawOnClick();
        }
    };
    return (
        <button
            onClick={onClick}
            className={classNames(styles.button, className, {
                [styles.isSecondary]: isSecondary,
                [styles.isDisabled]: isDisabled,
            })}
        >
            {children}
        </button>
    );
};

export default Button;
