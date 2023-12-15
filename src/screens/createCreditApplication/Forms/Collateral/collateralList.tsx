import React, { useState } from "react";
import styles from "../../createCreditApplication.module.css";
import Collateral from "./collateral";
import { CreditCollateralDocument } from "../../../../interfaces";
import { useCreditApplicationDataContext } from "../../../../context/creditApplDetailsContext";
import no_identity from "../../../../../src/assets/images/no_identity.png";
import Button from "../../../../components/Button/Button";
import { PlusOutlined } from "@ant-design/icons";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
const CollateralList = () => {
    const { creditApplDataFields_context, setCreditApplDataFields_context } =
        useCreditApplicationDataContext();
    const [open, setOpen] = useState(false);
    const [collateralValue, setCollateralvalue] = useState<any>();
    const { CustomerData, setCustomerData } = useCustomerContext();
    return (
        <div>
            {open ? (
                <Collateral
                    setOpen={setOpen}
                    collateralValue={collateralValue}
                    setCollateralvalue={setCollateralvalue}
                />
            ) : creditApplDataFields_context.collateralinfoData == null ||
              creditApplDataFields_context.collateralinfoData?.length <= 0 ? (
                <div className={styles["nodata-Container"]}>
                    <img
                        src={no_identity}
                        alt='No Date Found'
                        className={styles["imgData"]}
                    />
                    <div className={styles["text-Container"]}>
                        <p>Can't find any Collateral</p>
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
                                text={"Add Collateral"}
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
                    {creditApplDataFields_context.collateralinfoData.map(
                        (data, index) => {
                            return (
                                <div
                                    key={index}
                                    className={styles["card-container"]}
                                    onClick={(e) => {
                                        CustomerData.customerDraftReadOnlyFlag
                                            ? e.preventDefault()
                                            : setOpen(true);
                                        setCollateralvalue({
                                            data: data,
                                            index: index,
                                        });
                                    }}
                                >
                                    <div
                                        className={`${styles.card}`}
                                        style={{
                                            cursor: `${
                                                CustomerData.customerDraftReadOnlyFlag
                                                    ? "not-allowed"
                                                    : "pointer"
                                            }`,
                                        }}
                                    >
                                        <div className={styles["card-header"]}>
                                            Collateral - {index + 1}
                                        </div>
                                        <div className={styles["card-content"]}>
                                            <div
                                                className={
                                                    styles[
                                                        "card-content-section"
                                                    ]
                                                }
                                            >
                                                <p>Collateral Type</p>
                                                <p>
                                                    {data.collateralTypeDescription.toString()}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "card-content-section"
                                                    ]
                                                }
                                            >
                                                <p>Document Reference</p>
                                                <p>
                                                    {data.collateralDescription}
                                                </p>
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

export default CollateralList;
