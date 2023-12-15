import React from "react";
import { Modal } from "antd";
import styles from "./loader.module.css";

interface LoaderProps {
    loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }: LoaderProps) => {
    return (
        <Modal
            open={loading}
            className={"loadingModel"}
            footer={null}
            closable={false}
        >
            <div className={styles["loader"]}>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
                <div className={styles["loader-square"]}></div>
            </div>
            <h3 className={styles["loading-text"]}>
                Processing...
                <br />
                Please wait...
            </h3>
        </Modal>
    );
};

export default Loader;
