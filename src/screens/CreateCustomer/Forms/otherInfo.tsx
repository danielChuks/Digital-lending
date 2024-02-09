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
            const incomeAmount = parseFloat(value);
            setCustomerData((prev) => ({
                ...prev,
                otherInfoData: {
                    ...prev.otherInfoData,
                    [name]: isNaN(incomeAmount) ? "" : incomeAmount,
                },
            }));
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
                        <CustomSelector
                            label={"Currency"}
                            onChange={(e) => handleSelector(e, "amountUnit")}
                            optionsList={picklistData.currencyList}
                            value={CustomerData.otherInfoData.amountUnit}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"Monthly Income / Turnover"}
                                type={"text"}
                                // required={true}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.otherInfoData
                                        .monthlyIncomeAmount
                                }
                                name='monthlyIncomeAmount'
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default OtherInfo;
