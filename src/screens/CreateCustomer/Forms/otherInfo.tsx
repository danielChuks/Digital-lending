import React, { forwardRef, useImperativeHandle, useState } from "react";
import styles from "../createCustomer.module.css";
import InputField from "../../../components/InputFiled/InputField";
import CustomSelector from "../../../components/CustomSelector/customSelector";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import SimpleReactValidator from "simple-react-validator";
import { usePickListContext } from "../../../context/pickListDataContext";

// Define the props for the ChildComponent
type ChildComponentProps = {};

// Define the methods that will be exposed via the ref
interface ChildMethods {
    handleValidation: () => void;
}
const OtherInfo = forwardRef<ChildMethods, ChildComponentProps>(
    (props, ref: any) => {
        const { CustomerData, setCustomerData } = useCustomerContext();
        const { picklistData, setPicklistData } = usePickListContext();
        const [validator] = useState(new SimpleReactValidator());
        const isValidated = false;

        const handleAddressInfo = ({
            target: { value, name },
        }: React.ChangeEvent<HTMLInputElement>) => {
            // Parse the value to a number before setting it in the state
            const numericValue = parseFloat(value.trim());
            setCustomerData((prev) => ({
                ...prev,
                otherInfoData: {
                    ...prev.otherInfoData,
                    [name]: isNaN(numericValue) ? null : numericValue,
                },
            }));
        };

        const onhandleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = e.target;

            if (name === "monthlyIncomeAmount") {
                const numericValue = parseFloat(value.trim());
                if (!isNaN(numericValue)) {
                    const formattedValue = numericValue.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    );

                    setCustomerData((prev: any) => {
                        return {
                            ...prev,
                            otherInfoData: {
                                ...prev.otherInfoData,
                                monthlyIncomeAmount: formattedValue,
                            },
                        };
                    });
                } else {
                    setCustomerData((prev: any) => {
                        return {
                            ...prev,
                            otherInfoData: {
                                ...prev.otherInfoData,
                                monthlyIncomeAmount: "",
                            },
                        };
                    });
                }
            }
        };

        const handleSelector = (
            value: React.MouseEvent<Element, MouseEvent>,
            name: string
        ) => {
            setCustomerData((prev) => ({
                ...prev,
                otherInfoData: { ...prev.otherInfoData, [name]: value },
            }));
        };

        const handleValidation = () => {
            if (validator.allValid()) {
                ref.current.isValidated = true;
            } else {
                validator.showMessages();
                ref.current.isValidated = false;
                forceUpdate({});
            }
        };

        const [, forceUpdate] = useState({});

        // Expose the childFunction to the parent component using useImperativeHandle
        useImperativeHandle(ref, () => ({
            handleValidation,
            isValidated,
        }));

        return (
            <div>
                <div className={styles["basic-info-container"]}>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                stylesprops={styles.customRequireStyles}
                                label={"Opening Reason"}
                                onChange={(e) =>
                                    handleSelector(e, "openingReasonCd")
                                }
                                optionsList={picklistData.openingReasonList}
                                value={
                                    CustomerData.otherInfoData.openingReasonCd
                                }
                                name={"OpeningReason"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "OpeningReason",
                                    CustomerData.otherInfoData.openingReasonCd,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                stylesprops={styles.customRequireStyles}
                                label={"How did you find out about us?"}
                                onChange={(e) =>
                                    handleSelector(e, "marketingCampaignCd")
                                }
                                optionsList={picklistData.marketingCampaignList}
                                value={
                                    CustomerData.otherInfoData
                                        .marketingCampaignCd
                                }
                                name={"MarketingCampaign"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "MarketingCampaign",
                                    CustomerData.otherInfoData
                                        .marketingCampaignCd,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <CustomSelector
                            label={"Your source of income/funds?"}
                            onChange={(e) =>
                                handleSelector(e, "sourceOfFundCd")
                            }
                            optionsList={picklistData.sourceofFundList}
                            value={CustomerData.otherInfoData.sourceOfFundCd}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"Currency"}
                                onChange={() => null}
                                value={picklistData.currencyList[0].value}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                                type={"string"}
                            />
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <div
                                style={{ paddingBottom: "5px", color: "black" }}
                            >
                                Monthly Income / Turnover
                            </div>
                            <input
                                type={"string"}
                                onBlur={onhandleBlur}
                                style={{
                                    textAlign: "right",
                                    padding: "11px",
                                    borderRadius: "8px",
                                    border: "1px solid #006c33",
                                    outline: "none",
                                }}
                                name='monthlyIncomeAmount'
                                // required={true}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.otherInfoData
                                        .monthlyIncomeAmount
                                }
                                // readonly={
                                //     CustomerData.customerDraftReadOnlyFlag
                                // }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default OtherInfo;
