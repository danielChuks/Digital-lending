import React, {
    useState,
    useContext,
    useEffect,
    useRef,
    useImperativeHandle,
} from "react";
// import styles from "../../createCustomer.module.css";
import styles from "../../createCreditApplication.module.css";
import InputField from "../../../../components/InputFiled/InputField";
import CustomSelector from "../../../../components/CustomSelector/customSelector";
import { notification } from "antd";
import { useCreditApplicationDataContext } from "../../../../context/creditApplDetailsContext";
import CustomButton from "../../../../components/Button/Button";

///// edit create customer into creditapp /////
import {
    useGetPicklist,
    useCreateCreditApplDraft,
} from "../../createCreditApplicationService";
import SimpleReactValidator from "simple-react-validator";
import Loader from "../../../../components/Loader/loader";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../../components/Notification/commonnotification";
import { useNavigate } from "react-router-dom";
import usePopulateCustomerDraft from "../../../../Hooks/populateCreditDraft";
import CustomDatePicker from "../../../../components/CustomDatePicker/customDatePicker";
import { usePickListContext } from "../../../../context/pickListDataContext";
import { CreditCollateralDocument } from "../../../../context/creditApplDetailsContext";
import DialogueBox, {
    DialogueBoxProps,
} from "../../../../components/Model/model";
const Collateral: React.FC<any> = (props: any) => {
    const [validator] = useState(new SimpleReactValidator());
    const { creditApplDataFields_context, setCreditApplDataFields_context } =
        useCreditApplicationDataContext();
    const picklistMutation = useGetPicklist();
    const [, forceUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { populateCreditDraft } = usePopulateCustomerDraft();
    const { picklistData } = usePickListContext();
    const navigate = useNavigate();
    const createCreditApplDraftMutation = useCreateCreditApplDraft();
    const [collateraData, setCollateraData] =
        useState<CreditCollateralDocument>({
            collateralDescription: "",
            collateralMarketValue: "",
            collateralRefNo: "",
            collateralTypeDescription: "",
            collateralCurrencyId: null,
            collateralTypeId: "",
            expiryDateStr: "",
            forcedSalesValue: "",
            lendingPercent: "",
            lendingValue: "",
        });
    ///// picklist for collateral type /////
    const [pickCollateralType, setPickCollateralType] = useState<any>();
    const [modelData, setModelData] = useState<DialogueBoxProps>({
        title: "",
        content: "",
        okText: "",
        cancelText: "",
        onOk: "",
        onCancel: true,
    });
    const [modelOpen, setModelOpen] = useState(false);

    useEffect(() => {
        setCreditApplDataFields_context((prev) => ({
            ...prev,
            addDocumentFlag: true,
        }));
        return () => {
            setCreditApplDataFields_context((prev) => ({
                ...prev,
                addDocumentFlag: false,
            }));
        };
    }, []);

    useEffect(() => {
        if (props.collateralValue?.data) {
            setCollateraData({
                collateralDescription:
                    props.collateralValue.data.collateralDescription,
                collateralMarketValue:
                    props.collateralValue.data.collateralMarketValue,
                collateralRefNo: props.collateralValue.data.collateralRefNo,
                collateralTypeDescription:
                    props.collateralValue.data.collateralTypeDescription,
                collateralTypeId: props.collateralValue.data.collateralTypeId,
                expiryDateStr: props.collateralValue.data.expiryDateStr,
                forcedSalesValue: props.collateralValue.data.forcedSalesValue,
                lendingPercent: props.collateralValue.data.lendingPercent,
                lendingValue: props.collateralValue.data.lendingValue,
                collateralCurrencyId:
                    props.collateralValue.data.collateralCurrencyId,
            });
        }
    }, [props.collateralValue]);

    useEffect(() => {
        fetchCollateralType();
    }, [creditApplDataFields_context.basicInfo?.creditTypeId]);

    ///// fetch collateral lending value /////
    useEffect(() => {
        if (collateraData?.collateralTypeId) {
            fetchCollateralLendingPercentage();
        }
    }, [collateraData?.collateralTypeId]);

    ////// fetch the collatyeral type data /////
    const fetchCollateralType = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            category: "FETCH_COLLATERAL_TYPE_REF",
            subCategory: creditApplDataFields_context.basicInfo?.creditTypeId,
        };
        const data = await picklistMutation.mutateAsync(payload);
        if (data.status === 200) {
            if (data.data.pickListMap.FETCH_COLLATERAL_TYPE_REF) {
                let temp: { value: any; label: any }[] = [];
                data.data.pickListMap.FETCH_COLLATERAL_TYPE_REF?.map(
                    (data: { listKey: any; listDesc: any }) => {
                        temp.push({
                            value: data.listKey,
                            label: data.listDesc,
                        });
                    }
                );
                setPickCollateralType(temp);
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
            }, 2000);
        }
    };

    const fetchCollateralLendingPercentage = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            category: "FETCH_COLLATERAL_TYPE_LENDING_REF",
            subCategory: collateraData.collateralTypeId,
        };
        const data = await picklistMutation.mutateAsync(payload);
        if (data.status === 200) {
            if (data.data.pickListMap.FETCH_COLLATERAL_TYPE_LENDING_REF) {
                data.data.pickListMap.FETCH_COLLATERAL_TYPE_LENDING_REF?.map(
                    (data: any) => {
                        setCollateraData((prev: any) => ({
                            ...prev,
                            lendingPercent: data.listDesc,
                        }));
                    }
                );
            }
        } else if (data.errorCode === "CI_JWT_001") {
            const notificationData: CommonnotificationProps = {
                type: "info",
                msgtitle: "Notification",
                msgDesc: "Your session is over, Please login again",
                api: api,
            };
            openNotificationWithIcon(notificationData);
            setTimeout(() => {
                navigate({ pathname: "/login" });
            }, 2000);
        }
    };

    const handleSelector = (
        value: React.MouseEvent<Element, MouseEvent>,
        option: any,
        optionName: any,
        name: string
    ) => {
        if (option) {
            setCollateraData((prev: any) => ({
                ...prev,
                [optionName]: option.label,
            }));
        }
        setCollateraData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    ///// collateral save /////
    const handleCollateral = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validator.allValid()) {
            let arr: any;
            if (creditApplDataFields_context.collateralinfoData) {
                if (props.collateralValue) {
                    let temp = creditApplDataFields_context.collateralinfoData;
                    temp.splice(props?.collateralValue.index, 1);
                    if (temp.length > 0) {
                        arr = [...temp, collateraData];
                    } else {
                        arr = [collateraData];
                    }
                } else {
                    arr = [
                        ...creditApplDataFields_context.collateralinfoData,
                        collateraData,
                    ];
                }
            } else {
                arr = [collateraData];
            }
            let payload = {};
            payload = {
                instituteCode: sessionStorage.getItem("instituteCode"),
                transmissionTime: Date.now(),
                applData: {
                    ...creditApplDataFields_context.basicInfo,
                    collateralData: arr,
                },
                dbsCustApplId: Number(sessionStorage.getItem("dbsCustApplId")),
            };
            setIsLoading(true);
            const data = await createCreditApplDraftMutation.mutateAsync(
                payload
            );
            if (data.status === 200) {
                setIsLoading(false);
                sessionStorage.setItem(
                    "dbsCustApplId",
                    data.data.dbsCustApplId
                );
                populateCreditDraft();
                setCreditApplDataFields_context((prev) => ({
                    ...prev,
                    addDocumentFlag: false,
                }));
                props.setCollateralvalue();
                props.setOpen(false);
            } else if (
                data.errorCode === "CI_JWT_001" ||
                data.errorCode === "CI_JWT_002"
            ) {
                setIsLoading(false);
                const notificationData: CommonnotificationProps = {
                    type: "info",
                    msgtitle: "Notification",
                    msgDesc: "Your session is over, Please login again",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                setTimeout(() => {
                    navigate({ pathname: "/login" });
                }, 2000);
            } else {
                setIsLoading(false);
                const notificationData: CommonnotificationProps = {
                    type: "error",
                    msgtitle: data.errorCode,
                    msgDesc: data.errorMessage,
                    api: api,
                };
                openNotificationWithIcon(notificationData);
            }
        } else {
            validator.showMessages();
            forceUpdate({});
        }
    };

    ///// delete collateral ///////
    const handleDeleteCollateral = async (e: React.FormEvent) => {
        e.preventDefault();
        setModelOpen(true);
        setModelData({
            title: "Confirmation",
            content: "Are you sure, you want to delete the Collateral ?",
            okText: "Delete",
            cancelText: "Cancel",
            onOk: async () => {
                setModelOpen(false);
                let arr: any;
                if (creditApplDataFields_context.collateralinfoData) {
                    let temp =
                        creditApplDataFields_context.collateralinfoData.splice(
                            props.collateralValue?.index,
                            1
                        );

                    if (temp.length > 0) {
                        arr = [
                            ...creditApplDataFields_context.collateralinfoData,
                        ];
                    } else {
                        arr = null;
                    }
                }

                const payload = {
                    instituteCode: sessionStorage.getItem("instituteCode"),
                    transmissionTime: Date.now(),
                    applData: {
                        ...creditApplDataFields_context.basicInfo,
                        collateralData: arr,
                    },
                    dbsCustApplId: Number(
                        sessionStorage.getItem("dbsCustApplId")
                    ),
                };
                setIsLoading(true);
                const data = await createCreditApplDraftMutation.mutateAsync(
                    payload
                );
                if (data.status === 200) {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "success",
                        msgtitle: "success",
                        msgDesc: "Collateral Deleted Successfully ",
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                    props.setCollateralvalue();
                    populateCreditDraft();
                    setCreditApplDataFields_context((prev) => ({
                        ...prev,
                        addDocumentFlag: false,
                    }));
                    setTimeout(() => {
                        props.setOpen(false);
                    }, 2000);
                } else if (
                    data.errorCode === "CI_JWT_001" ||
                    data.errorCode === "CI_JWT_002"
                ) {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "info",
                        msgtitle: "Notification",
                        msgDesc: "Your session is over, Please login again",
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                    setTimeout(() => {
                        navigate({ pathname: "/login" });
                    }, 2000);
                } else {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "error",
                        msgtitle: data.errorCode,
                        msgDesc: data.errorMessage,
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                }
            },
            onCancel: true,
        });
    };

    const handleBasicInfo = ({
        target: { value, name },
    }: React.ChangeEvent<HTMLInputElement>) => {
        if (name === "collateralMarketValue") {
            setCollateraData((prev: any) => {
                return {
                    ...prev,
                    [name]: value,
                    forcedSalesValue: value,
                };
            });
        } else {
            setCollateraData((prev: any) => {
                return { ...prev, [name]: value };
            });
        }
    };

    useEffect(() => {
        if (
            collateraData.lendingPercent &&
            collateraData.collateralMarketValue
        ) {
            const lendingValue = (
                (collateraData.lendingPercent / 100) *
                collateraData.collateralMarketValue
            ).toFixed(2);
            setCollateraData((prev: any) => {
                return { ...prev, lendingValue: lendingValue };
            });
        }
    }, [collateraData.collateralMarketValue, collateraData.lendingPercent]);

    return (
        <>
            {contextHolder}
            <Loader loading={isLoading} />
            <DialogueBox
                open={modelOpen}
                DialogueBoxProps={modelData}
                setOpen={setModelOpen}
            />
            <div>
                <div className={styles["basic-info-container"]}>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Collateral Type"}
                                onChange={(e, option) =>
                                    handleSelector(
                                        e,
                                        option,
                                        "collateralTypeDescription",
                                        "collateralTypeId"
                                    )
                                }
                                optionsList={pickCollateralType}
                                value={collateraData?.collateralTypeId?.toString()}
                                name='collateralTypeId'
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "collateralTypeId",
                                    collateraData?.collateralTypeId,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <InputField
                                label={"Collateral Reference"}
                                type={"text"}
                                // required={true}
                                onChange={handleBasicInfo}
                                value={collateraData?.collateralRefNo}
                                name='collateralRefNo'
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "countryOfIssueId",
                                    collateraData?.collateralRefNo,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <InputField
                                label={"Collateral Description"}
                                type={"text"}
                                // required={true}
                                onChange={handleBasicInfo}
                                value={collateraData?.collateralDescription}
                                name='collateralDescription'
                            />
                        </div>
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Currency"}
                                onChange={(e) =>
                                    handleSelector(
                                        e,
                                        "",
                                        "",
                                        "collateralCurrencyId"
                                    )
                                }
                                optionsList={picklistData.currencyList}
                                value={collateraData.collateralCurrencyId?.toString()}
                                name={"collateralCurrencyId"}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "collateralCurrencyId",
                                    collateraData?.collateralCurrencyId,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div className={styles[""]}>
                            <InputField
                                label={"Amount"}
                                type={"number"}
                                required={true}
                                onChange={handleBasicInfo}
                                value={collateraData?.collateralMarketValue}
                                name='collateralMarketValue'
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "collateralMarketValue",
                                    collateraData?.collateralMarketValue,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomDatePicker
                                label={"Maturity Date"}
                                value={collateraData?.expiryDateStr}
                                onChange={(date: any, dateString: any) => {
                                    setCollateraData((prev: any) => ({
                                        ...prev,
                                        expiryDateStr: dateString,
                                    }));
                                }}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "countryOfIssueId",
                                    collateraData?.expiryDateStr,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["button-Outer-Container"]}>
                <div className={styles["button-Container"]}>
                    <div className={styles["save-button"]}>
                        <CustomButton
                            text={"Save Collateral"}
                            type='button'
                            onClick={handleCollateral}
                        />
                    </div>
                    <div className={styles["delete-button"]}>
                        {props.collateralValue?.data ? (
                            <CustomButton
                                text={"Delete Collateral"}
                                type='button'
                                onClick={handleDeleteCollateral}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <div className={styles["close-button"]}>
                        <CustomButton
                            text={"Close"}
                            type={"button"}
                            onClick={() => {
                                props.setOpen(false);
                                setCreditApplDataFields_context((prev) => ({
                                    ...prev,
                                    addDocumentFlag: false,
                                }));
                                props.setCollateralvalue();
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Collateral;
