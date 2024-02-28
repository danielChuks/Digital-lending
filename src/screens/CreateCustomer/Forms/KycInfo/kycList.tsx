import { useState } from "react";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
import styles from "../../createCustomer.module.css";
import KycInfo from "./kycInfo";
import no_identity from "../../../../../src/assets/images/no_identity.png";
import Button from "../../../../components/Button/Button";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const KycList = () => {
    const { CustomerData } = useCustomerContext();
    const [open, setOpen] = useState(false);
    const [identityData, setIdentityData] = useState<any>();

    return (
        <div>
            {open ? (
                <KycInfo
                    setOpen={setOpen}
                    identityData={identityData}
                    setIdentityData={setIdentityData}
                />
            ) : CustomerData.identificationInfoData == null ||
              CustomerData.identificationInfoData.length <= 0 ? (
                <div className={styles["nodata-Container"]}>
                    <img
                        src={no_identity}
                        alt='No Date Found'
                        className={styles["imgData"]}
                    />
                    <div className={styles["text-Container"]}>
                        <p>Can't find any identification</p>
                        {CustomerData.customerDraftReadOnlyFlag ? (
                            ""
                        ) : (
                            <p>Please add one</p>
                        )}
                    </div>
                    {CustomerData.customerDraftReadOnlyFlag ? (
                        ""
                    ) : (
                        <div className={styles["button-Container"]}>
                            <Button
                                text={"Add Identification"}
                                type={"button"}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles["card-main-container"]}>
                    {CustomerData.identificationInfoData?.map(
                        (data: any, index: number) => {
                            return (
                                <div
                                    className={`${styles.card_container}`}
                                    onClick={(e) => {
                                        CustomerData.customerDraftReadOnlyFlag
                                            ? e.preventDefault()
                                            : setOpen(true);
                                        setIdentityData({
                                            data: data,
                                            index: index,
                                        });
                                    }}
                                >
                                    <div
                                        className={`${styles.card} ${
                                            CustomerData.customerDraftReadOnlyFlag
                                                ? styles.readOnlyCard
                                                : ""
                                        }`}
                                    >
                                        <div className={styles["card-header"]}>
                                            Identification - {index + 1}
                                        </div>
                                        <div className={styles["card-content"]}>
                                            <div
                                                className={
                                                    styles[
                                                        "card-content-section"
                                                    ]
                                                }
                                            >
                                                <p>Identification Type</p>
                                                <p>{data.identityTypeDesc}</p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "card-content-section"
                                                    ]
                                                }
                                            >
                                                <p>Identification Number</p>
                                                <p>{data.identityNumber}</p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "card-content-section"
                                                    ]
                                                }
                                            >
                                                <p>Expiry Date</p>
                                                <p>{data.strExpiryDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                    {CustomerData.customerDraftReadOnlyFlag ? (
                        ""
                    ) : (
                        <div className={styles["card-container"]}>
                            <div
                                className={styles["addnew-card"]}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <div className={styles["addnew-card-content"]}>
                                    <div>
                                        <PlusOutlined
                                            style={{ fontSize: "30px" }}
                                        />
                                    </div>
                                    <div>Add New</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KycList;
