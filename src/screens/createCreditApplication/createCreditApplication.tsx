import React, { useState, useEffect, useRef } from "react";
import styles from "./createCreditApplication.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { ConfigProvider, Steps, notification } from "antd";
import BasicInfo from "./Forms/basicInfo";
import DocumentList from "./Forms/Document/documentList";
import { useCreditApplicationDataContext } from "../../context/creditApplDetailsContext";
/** picklist generation */
import { usePickListContext } from "../../context/pickListDataContext";
import {
    useCreateCreditApplDraft,
    useCreateDBSCreditAppl,
    useGetPicklist,
} from "./createCreditApplicationService";

import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import CollateralList from "./Forms/Collateral/collateralList";
/**end*/

/**load db data */
import usePopulateCreditDraft from "../../Hooks/populateCreditDraft";

import Loader from "../../components/Loader/loader";
import { useCustomerContext } from "../../context/customerDetailsContext";

const CreateCreditApplication = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const { setPicklistData } = usePickListContext();
    const picklistMutation = useGetPicklist();
    const { creditApplDataFields_context, setCreditApplDataFields_context } =
        useCreditApplicationDataContext();
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const BasicInfovalidref = useRef<any | null>(null);
    const { populateCreditDraft } = usePopulateCreditDraft();
    const createDBSCreditApplMutation = useCreateDBSCreditAppl();
    const createCreditApplDraftMutation = useCreateCreditApplDraft();
    const { CustomerData, setCustomerData } = useCustomerContext();
    const stepsList = [
        {
            title: "Basic info",
        },
        {
            title: "Documents",
        },
        {
            title: "Collateral",
        },
    ];

    ////// picklist load //////
    const populatePickList = (list: any, context: any) => {
        let temp: { value: any; label: any }[] = [];
        if (list?.length > 0) {
            list.map((data: { listKey: any; listDesc: any }) => {
                temp.push({
                    value: data.listKey,
                    label: data.listDesc,
                });
            });
        }
        setPicklistData((prev) => ({
            ...prev,
            [context]: temp,
        }));
    };

    ///// picklist data for credit apllication /////
    const fetchPicklistData = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            groupCode: "CREDIT_APPL",
        };
        const data: any = await picklistMutation.mutateAsync(payload);
        if (data.status === 200) {
            let pickListMap = [
                {
                    data: data.data.pickListMap.FETCH_CAUTION_LIST,
                    context: "cautionList",
                },
                {
                    data: data.data.pickListMap
                        .FETCH_COLLATERAL_TYPE_LENDING_REF,
                    context: "collateralTypeLendingList",
                },
                {
                    data: data.data.pickListMap.FETCH_COLLATERAL_TYPE_REF,
                    context: "collatteralTypeRefList",
                },
                {
                    data: data.data.pickListMap.FETCH_CREDIT_DOCUMENT_REF,
                    context: "creditDocumentRefList",
                },
                {
                    data: data.data.pickListMap.FETCH_CREDIT_OFFICER,
                    context: "creditOfficerList",
                },
                {
                    data: data.data.pickListMap.FETCH_CREDIT_PORTFOLIO,
                    context: "creditPortfolioList",
                },
                {
                    data: data.data.pickListMap.FETCH_CREDIT_TYPE,
                    context: "creditTypeList",
                },
                {
                    data: data.data.pickListMap
                        .FETCH_CREDIT_UTILISATION_BY_CREDIT_TYPE,
                    context: "creditUlitisationTypeList",
                },
                {
                    data: data.data.pickListMap.FETCH_INDUSTRY,
                    context: "industryList",
                },

                {
                    data: data.data.pickListMap.FETCH_CURRENCY_LIST,
                    context: "currencyList",
                },
                {
                    data: data.data.pickListMap.FETCH_PRODUCT_BY_CREDIT_TYPE,
                    context: "productCreditTypeList",
                },
                {
                    data: data.data.pickListMap
                        .FETCH_PRODUCT_BY_CUSTOMER_AND_CREDIT_TYPE,
                    context: "productCustomerAndCreditTypeList",
                },
                {
                    data: data.data.pickListMap.FETCH_PURPOSE_OF_CREDIT,
                    context: "purposeOfCreditTypeList",
                },

                {
                    data: data.data.pickListMap.FETCH_FREQUENCY_REF,
                    context: "termCode",
                },
            ];
            pickListMap.map((data) => {
                populatePickList(data.data, data.context);
            });
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
        setIsLoading(creditApplDataFields_context.loading);
    }, [creditApplDataFields_context.loading]);

    useEffect(() => {
        if (!(sessionStorage.getItem("dbsCustApplId") === null)) {
            populateCreditDraft();
        } else {
            setCreditApplDataFields_context({
                basicInfo: {
                    amount: "",
                    creditTypeId: null,
                    currencyId: "732",
                    productId: null,
                    purposeOfCreditId: null,
                    strApplicationDate: "",
                    termCode: "",
                    termValue: null,
                    repaySourceAcctNo: "",
                },
                collateralinfoData: null,
                documentInfodata: null,
                addDocumentFlag: false,
                loading: false,
            });
        }
        fetchPicklistData();

        if (sessionStorage.getItem("customerDraftFlag") === "true") {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftFlag: true,
            }));
        }

        if (sessionStorage.getItem("customerDraftReadOnlyFlag") === "true") {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftReadOnlyFlag: true,
            }));
        } else {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftReadOnlyFlag: false,
            }));
        }
    }, []);

    /**end */
    const componentValidation = (param: any) => {
        const data = [BasicInfovalidref];
        if (data[param]) {
            data[param]?.current?.handleValidation();
            return data[param].current.isValidated;
        } else {
            return true;
        }
    };
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            CustomerData.customerDraftReadOnlyFlag ||
            currentStep === 1 ||
            currentStep === 2
        ) {
            setCurrentStep((prev) => prev + 1);
        } else {
            const isValid = componentValidation(currentStep);
            if (isValid) {
                let payload = {};
                if (sessionStorage.getItem("dbsCustApplId") === null) {
                    payload = {
                        instituteCode: sessionStorage.getItem("instituteCode"),
                        transmissionTime: Date.now(),

                        applData: {
                            ...creditApplDataFields_context.basicInfo,
                            collateralData: [],
                        },
                    };
                    console.log(payload)
                } else {
                    payload = {
                        instituteCode: sessionStorage.getItem("instituteCode"),
                        transmissionTime: Date.now(),

                        applData: {
                            ...creditApplDataFields_context.basicInfo,
                            // amount: Number(
                            //     creditApplDataFields_context.basicInfo?.amount?.replaceAll(
                            //         ",",
                            //         ""
                            //     )
                            // ),
                            collateralData:
                                creditApplDataFields_context.collateralinfoData,
                                
                        },

                        dbsCustApplId: Number(
                            sessionStorage.getItem("dbsCustApplId")
                        ),
                    };
                    console.log(payload)
                }
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
                    setCurrentStep((prev) => prev + 1);
                } else if (data.errorCode === "CI_JWT_001") {
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
            }
        }
    };

    const handleCreateCreditApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            instituteCode: sessionStorage.getItem("instituteCode"),
            transmissionTime: Date.now(),
            applData: {
                // collateralData:creditApplDataFields_context.collateralinfoData,
                ...creditApplDataFields_context.basicInfo,
                // amount: Number(
                //     creditApplDataFields_context.basicInfo?.amount?.replaceAll(
                //         ",",
                //         ""
                //     )
                // ),
                collateralData: creditApplDataFields_context.collateralinfoData,
                documentList: creditApplDataFields_context.documentInfodata,
            },

            dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
            dbsCustApplId: Number(sessionStorage.getItem("dbsCustApplId")),
        };
        console.log(payload)
        setIsLoading(true);
        const data = await createDBSCreditApplMutation.mutateAsync(payload);
        if (data.status === 200) {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: "success",
                msgtitle: "Success ",
                msgDesc: "Credit Application Created SuccessFully",
                api: api,
            };
            openNotificationWithIcon(notificationData);
            setTimeout(() => {
                navigate({ pathname: "/dashboard" });
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
    };
    return (
        <>
            {contextHolder}
            <Loader loading={isLoading} />
            <div className={"main-container"}>
                <div className={"main-heading"}>Create Credit Application</div>
                <section className={styles["customer-type-content"]}>
                    <form onSubmit={handleFormSubmit}>
                        <>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: "#39C594",
                                    },
                                }}
                            >
                                <Steps
                                    current={currentStep}
                                    items={[
                                        {
                                            title: "Basic info",
                                        },
                                        {
                                            title: "Documents",
                                        },
                                        {
                                            title: "Collateral",
                                        },
                                    ]}
                                />
                            </ConfigProvider>
                        </>
                        <div className={styles["form-box"]}>
                            {currentStep === 0 ? (
                                <BasicInfo ref={BasicInfovalidref} />
                            ) : currentStep === 1 ? (
                                <DocumentList />
                            ) : currentStep === 2 ? (
                                <CollateralList />
                            ) : (
                                ""
                            )}
                        </div>
                        <div className={styles["buton-container"]}>
                            {currentStep !== 0 ? (
                                <Button
                                    text={"Back"}
                                    type={"button"}
                                    disabled={false}
                                    buttonType={"back"}
                                    icon={true}
                                    onClick={() => {
                                        setCurrentStep((prev) => prev - 1);
                                    }}
                                />
                            ) : (
                                ""
                            )}

                            {currentStep === 2 &&
                            !CustomerData.customerDraftReadOnlyFlag ? (
                                <>
                                    <div className={styles["submit"]}>
                                        {!creditApplDataFields_context.addDocumentFlag ? (
                                            <Button
                                                text={"Submit"}
                                                type={"submit"}
                                                disabled={false}
                                                buttonType={""}
                                                onClick={
                                                    handleCreateCreditApplication
                                                }
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                            {currentStep === 0 ? <div></div> : ""}
                            {currentStep === stepsList.length - 1 ? (
                                ""
                            ) : !creditApplDataFields_context.addDocumentFlag ? (
                                <Button
                                    text={"Next"}
                                    type={"submit"}
                                    disabled={false}
                                    buttonType={"next"}
                                    icon={true}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
};
export default CreateCreditApplication;
