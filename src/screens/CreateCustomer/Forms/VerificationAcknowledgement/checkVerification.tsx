import styles from "./checksVerification.module.css";

export const CheckVerification = () => {
    return (
        <div className={styles["container"]}>
            <div className={styles["header"]}>Identity Verification checks</div>
            <div className={styles["subtitle"]}>
                We are about to conduct Identity Verification for the following
                issues:
            </div>

            <div className={styles["table-contanier"]}>
                <div className={styles["table-header"]}>
                    <div>Identification Types</div>
                    <div className={styles["iDcontent"]}>
                        National Identity No (NIN)
                    </div>
                    <div className={styles["iDcontent"]}>
                        Bank Verification No (BVN)
                    </div>
                </div>
                <div className={styles["table-header"]}>
                    <div>ID Number</div>
                    <div className={styles["iDcontent"]}>
                        xxxxxxxxxxxxxxxxxx
                    </div>
                    <div className={styles["iDcontent"]}>
                        xxxxxxxxxxxxxxxxxx
                    </div>
                </div>
                <div className={styles["table-header"]}>
                    <div>Outcome</div>
                    <div className={styles["iDcontent"]}>Not Verified</div>
                    <div className={styles["iDcontent"]}>Not Verified</div>
                </div>
            </div>
            <div className={styles["checkbox"]}>
                <div>
                    I consent to external Verification of my identity with the
                    identification provides as listed above:
                </div>
                <div>
                    <input type='checkbox' />
                </div>
            </div>
        </div>
    );
};
