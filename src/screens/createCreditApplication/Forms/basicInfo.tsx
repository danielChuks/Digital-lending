import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import styles from "../createCreditApplication.module.css";
import InputField from "../../../components/InputFiled/InputField";
import CustomSelector from "../../../components/CustomSelector/customSelector";
import { notification } from "antd";
import { useNavigate } from "react-router";
import CustomDatePicker from "../../../components/CustomDatePicker/customDatePicker";
import { useCreditApplicationDataContext } from "../../../context/creditApplDetailsContext";
import { usePickListContext } from "../../../context/pickListDataContext";
import { useGetPicklist } from "../createCreditApplicationService";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../components/Notification/commonnotification";
import SimpleReactValidator from "simple-react-validator";
import { useAccountList } from "../../Dashboard/Account/account";
import { UserDetailRequest } from "../../OtpVerification/otp";
import { useCustomerContext } from "../../../context/customerDetailsContext";

// Define the props for the ChildComponent
type ChildComponentProps = {};

// Define the methods that will be exposed via the ref
interface ChildMethods {
    handleValidation: () => void;
}

const BasicInfo = forwardRef<ChildMethods, ChildComponentProps>(
    (props, ref: any) => {
        const [validator] = useState(new SimpleReactValidator());
        const [isIndividual, setIsIndividual] = useState(true);
        const isValidated = false;
        const [api, contextHolder] = notification.useNotification();
        const navigate = useNavigate();
        const {
            creditApplDataFields_context,
            setCreditApplDataFields_context,
        } = useCreditApplicationDataContext();
        const accountListMutation = useAccountList();
        const { picklistData } = usePickListContext();
        const picklistMutation = useGetPicklist();
        const [product, setProduct] = useState<any>();
        const [purposeCredit, setPurposeCredit] = useState<any>();
        const [settelementData, setSettelementData] = useState<any>();
        const { CustomerData, setCustomerData } = useCustomerContext();

        ///// fetch the product data /////
        const fetchproduct = async () => {
            const payload = {
                instituteCode: "DBS01",
                transmissionTime: Date.now(),
                category: "FETCH_PRODUCT_BY_CREDIT_TYPE",
                subCategory:
                    creditApplDataFields_context.basicInfo?.creditTypeId,
            };
            const data = await picklistMutation.mutateAsync(payload);
            if (data.status === 200) {
                if (data.data.pickListMap.FETCH_PRODUCT_BY_CREDIT_TYPE) {
                    let temp: { value: any; label: any }[] = [];
                    data.data.pickListMap.FETCH_PRODUCT_BY_CREDIT_TYPE?.map(
                        (data: { listKey: any; listDesc: any }) => {
                            temp.push({
                                value: data.listKey,
                                label: data.listDesc,
                            });
                        }
                    );
                    setProduct(temp);
                }
            } else if (
                data.errorCode === "CI_JWT_001" ||
                data.errorCode === "CI_JWT_002"
            ) {
                const notificationData: CommonnotificationProps = {
                    type: "info",
                    msgtitle: "Notification",
                    msgDesc: "Your session is over, Please login again",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                setTimeout(() => {
                    navigate({ pathname: "/login" });
                }, 3000);
            }
        };

        useEffect(() => {
            if (creditApplDataFields_context?.basicInfo?.creditTypeId) {
                fetchproduct();
                fetchPurposeCredit();
            }
        }, [creditApplDataFields_context?.basicInfo?.creditTypeId]);

        useEffect(() => {
            fetchSettelementData();
        }, []);

        //////  fetch the PurposeCredit data /////
        const fetchPurposeCredit = async () => {
            const payload = {
                instituteCode: "DBS01",
                transmissionTime: Date.now(),
                category: "FETCH_PURPOSE_OF_CREDIT",
                subCategory:
                    creditApplDataFields_context.basicInfo?.creditTypeId,
            };
            const data = await picklistMutation.mutateAsync(payload);
            if (data.status === 200) {
                if (data.data.pickListMap.FETCH_PURPOSE_OF_CREDIT) {
                    let temp: { value: any; label: any }[] = [];
                    data.data.pickListMap.FETCH_PURPOSE_OF_CREDIT?.map(
                        (data: { listKey: any; listDesc: any }) => {
                            temp.push({
                                value: data.listKey,
                                label: data.listDesc,
                            });
                        }
                    );

                    setPurposeCredit(temp);
                }
            } else if (
                data.errorCode === "CI_JWT_001" ||
                data.errorCode === "CI_JWT_002"
            ) {
                const notificationData: CommonnotificationProps = {
                    type: "info",
                    msgtitle: "Notification",
                    msgDesc: "Your session is over, Please login again",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                setTimeout(() => {
                    navigate({ pathname: "/login" });
                }, 3000);
            }
        };

        ////// fetch the fetch settelement data //////
        const fetchSettelementData = async () => {
            const requestdata: UserDetailRequest = {
                instituteCode: sessionStorage.getItem("instituteCode") || "{}",
                transmissionTime: Date.now(),
                dbsUserId: sessionStorage.getItem("dbsUserId") || "{}",
            };
            const data: any = await accountListMutation.mutateAsync(
                requestdata
            );

            if (data.status === 200) {
                if (data.data.dpAcctDetails?.length > 0) {
                    let temp: { value: any; label: any }[] = [];
                    data.data.dpAcctDetails?.map((data: any) => {
                        if (data.status === "Active") {
                            temp.push({
                                value: data.acctNo,
                                label: data.acctNo,
                            });
                        }
                    });
                    setSettelementData(temp);
                }
            } else if (
                data.errorCode === "CI_JWT_001" ||
                data.errorCode === "CI_JWT_002"
            ) {
                const notificationData: CommonnotificationProps = {
                    type: "info",
                    msgtitle: "Notification",
                    msgDesc: "Your session is over, Please login again",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                setTimeout(() => {
                    navigate({ pathname: "/login" });
                }, 3000);
            }
        };
        const handleBasicInfo = ({
            target: { value, name },
        }: React.ChangeEvent<HTMLInputElement>) => {
            const numericValue = parseInt(value.trim());
            setCreditApplDataFields_context((prev: any) => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    [name]: isNaN(numericValue) ? null : numericValue,
                },
            }));
        };

        const onhandleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = e.target;

            if (name === "amount") {
                const numericValue = parseFloat(value.trim());
                if (!isNaN(numericValue)) {
                    // const formattedValue = numericValue.toLocaleString(
                    //     "en-US",
                    //     {
                    //         minimumFractionDigits: 2,
                    //         maximumFractionDigits: 2,
                    //     }
                    // );
                    const formattedValue = numericValue.toFixed(2);
                    setCreditApplDataFields_context((prev: any) => ({
                        ...prev,
                        basicInfo: {
                            ...prev.basicInfo,
                            amount: formattedValue,
                        },
                    }));
                } else {
                    setCreditApplDataFields_context((prev: any) => ({
                        ...prev,
                        basicInfo: {
                            ...prev.basicInfo,
                            amount: "",
                        },
                    }));
                }
            }
        };

        const handleSelector = (
            value: React.MouseEvent<Element, MouseEvent>,
            name: string
        ) => {
            setCreditApplDataFields_context((prev: any) => ({
                ...prev,
                basicInfo: { ...prev.basicInfo, [name]: value },
            }));

            if (name === "creditTypeId") {
                setCreditApplDataFields_context((prev: any) => {
                    return {
                        ...prev,
                        basicInfo: {
                            ...prev.basicInfo,
                            productId: "",
                            purposeOfCreditId: null,
                        },
                    };
                });
            }
        };

        const handleValidation = () => {
            if (isIndividual) {
                validator.fields.organisationName = true;
            } else {
                validator.fields.firstName = true;
                validator.fields.countryOfBirthId = true;
                validator.fields.lastName = true;
                validator.fields.maritalStatus = true;
                validator.fields.noOfDependents = true;
                validator.fields.titleCd = true;
                validator.fields.gender = true;
            }

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
            <div className={styles["basic-info-container"]}>
                <div className={styles["input-container-split"]}>
                    <div>
                        <CustomSelector
                            label={"Credit Type"}
                            onChange={(e) => handleSelector(e, "creditTypeId")}
                            optionsList={picklistData.creditTypeList}
                            value={creditApplDataFields_context.basicInfo?.creditTypeId?.toString()}
                            name='creditTypeId'
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "creditTypeId",
                                creditApplDataFields_context.basicInfo
                                    ?.creditTypeId,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <CustomSelector
                            label={"Product"}
                            onChange={(e) => handleSelector(e, "productId")}
                            optionsList={product}
                            value={creditApplDataFields_context.basicInfo?.productId?.toString()}
                            name={"productId"}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "productId",
                                creditApplDataFields_context.basicInfo
                                    ?.productId,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <CustomSelector
                            label={"Currency"}
                            onChange={(e) => handleSelector(e, "currencyId")}
                            optionsList={picklistData.currencyList}
                            value={creditApplDataFields_context.basicInfo?.currencyId?.toString()}
                            name={"currencyId"}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "currencyId",
                                creditApplDataFields_context.basicInfo
                                    ?.currencyId,
                                "required"
                            )}
                        </span>
                    </div>

                    <div className={styles["validator-block"]}>
                        <InputField
                            label={"Amount"}
                            type={"text"}
                            onChange={handleBasicInfo}
                            value={
                                creditApplDataFields_context.basicInfo?.amount
                            }
                            onBlur={onhandleBlur}
                            name='amount'
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "amount",
                                creditApplDataFields_context.basicInfo?.amount,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div>
                        <>
                            <CustomDatePicker
                                label={"Application Date"}
                                value={
                                    creditApplDataFields_context.basicInfo
                                        ?.strApplicationDate
                                }
                                onChange={(date: any, dateString: any) => {
                                    setCreditApplDataFields_context(
                                        (prev: any) => ({
                                            ...prev,
                                            basicInfo: {
                                                ...prev.basicInfo,
                                                strApplicationDate: dateString,
                                            },
                                        })
                                    );
                                }}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "strApplicationDate",
                                    creditApplDataFields_context.basicInfo
                                        ?.strApplicationDate,
                                    "required"
                                )}
                            </span>
                        </>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <InputField
                            label={"Terms"}
                            type={"number"}
                            // required={true}
                            onChange={handleBasicInfo}
                            value={creditApplDataFields_context.basicInfo?.termValue?.toString()}
                            name='termValue'
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "termValue",
                                creditApplDataFields_context.basicInfo
                                    ?.termValue,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <CustomSelector
                            label={"Code"}
                            onChange={(e) => handleSelector(e, "termCode")}
                            optionsList={picklistData.termCode}
                            value={
                                creditApplDataFields_context.basicInfo?.termCode
                            }
                            name={"termCode"}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />

                        <span className='text-error'>
                            {validator.message(
                                "termCode",
                                creditApplDataFields_context.basicInfo
                                    ?.termCode,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <CustomSelector
                            label={"Settlement Account"}
                            onChange={(e) =>
                                handleSelector(e, "repaySourceAcctNo")
                            }
                            optionsList={settelementData}
                            value={creditApplDataFields_context.basicInfo?.repaySourceAcctNo?.toString()}
                            name={"repaySourceAcctNo"}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />

                        <span className='text-error'>
                            {validator.message(
                                "repaySourceAcctNo",
                                creditApplDataFields_context.basicInfo
                                    ?.repaySourceAcctNo,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["input-container-split"]}>
                    <div className={styles["validator-block"]}>
                        <CustomSelector
                            label={"Purpose of Credit"}
                            onChange={(e) =>
                                handleSelector(e, "purposeOfCreditId")
                            }
                            optionsList={purposeCredit}
                            value={creditApplDataFields_context.basicInfo?.purposeOfCreditId?.toString()}
                            name={"purposeOfCreditId"}
                            readonly={CustomerData.customerDraftReadOnlyFlag}
                        />

                        <span className='text-error'>
                            {validator.message(
                                "purposeOfCreditId",
                                creditApplDataFields_context.basicInfo
                                    ?.purposeOfCreditId,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);

export default BasicInfo;
