import React, { useState, useEffect, useRef } from "react";
import styles from "./createCustomer.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { ConfigProvider, Steps, notification } from "antd";
// import SimpleReactValidator from 'simple-react-validator';
import BasicInfo from "./Forms/basicInfo";
import AddressInfo from "./Forms/addressInfo";
import OtherInfo from "./Forms/otherInfo";
import {
    useCreateCustomerDraft,
    useCreateDBSCustomer,
    useGetPicklist,
} from "./createCustomerService";
import KycList from "./Forms/KycInfo/kycList";
import DocumentList from "./Forms/DocumentInfo/documentList";
import ImageInfo from "./Forms/imageInfo";
import { useCustomerContext } from "../../context/customerDetailsContext";
import { usePickListContext } from "../../context/pickListDataContext";
import usePopulateCustomerDraft from "../../Hooks/populateCustomerDraft";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import Loader from "../../components/Loader/loader";
import { CheckVerification } from "./Forms/VerificationAcknowledgement/checkVerification";
import { useRecoilValue } from "recoil";
import { verificationAtom } from "../../state";

const CreateCustomer = () => {
    // const [validator] = useState(new SimpleReactValidator());
    const picklistMutation = useGetPicklist();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { CustomerData, setCustomerData } = useCustomerContext();
    const { setPicklistData } = usePickListContext();
    const { populateCustomerDraft } = usePopulateCustomerDraft();
    const createCustomerDraftMutation = useCreateCustomerDraft();
    const createDBSCustomerMutation = useCreateDBSCustomer();
    const [api, contextHolder] = notification.useNotification();
    // Create a ref for the child component
    const basicInfoValidationRef = useRef<any | null>(null);
    const addressInfoValidationRef = useRef<any | null>(null);
    const otherInfoValidationRef = useRef<any | null>(null);
    const verificationPassed = useRecoilValue(verificationAtom);

    const stepsList = [
        {
            title: "Basic info",
        },
        {
            title: "Address info",
        },
        {
            title: "Other info",
        },
        {
            title: "KYC info",
        },
        {
            title: "Documents",
        },
        {
            title: "Image info",
        },
    ];

    useEffect(() => {
        setCustomerData((prev) => ({
            ...prev,
            addDocumentFlag: false,
        }));

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

    const fetchPicklistData = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            groupCode: "CUSTOMER",
        };

        const data: any = await picklistMutation.mutateAsync(payload);

        if (data.status === 200) {
            let pickListMap = [
                {
                    data: data.data.pickListMap.FETCH_TITLES,
                    context: "titleList",
                },
                {
                    data: data.data.pickListMap.FETCH_ADDRESS_TYPE,
                    context: "addressTypeList",
                },
                {
                    data: data.data.pickListMap.FETCH_COUNTRY,
                    context: "countryList",
                },
                {
                    data: data.data.pickListMap.FETCH_NATIONALITIES,
                    context: "nationalityList",
                },
                {
                    data: data.data.pickListMap.FETCH_INDUSTRIES,
                    context: "industryList",
                },
                {
                    data: data.data.pickListMap.FETCH_MARITAL_STATUS_REF,
                    context: "maritalStatusList",
                },
                {
                    data: data.data.pickListMap.FETCH_GENDER_REF,
                    context: "genderList",
                },
                {
                    data: data.data.pickListMap.FETCH_OCCUPATIONS,
                    context: "occupationList",
                },
                {
                    data: data.data.pickListMap.FETCH_CURRENCIES,
                    context: "currencyList",
                },
                {
                    data: data.data.pickListMap.FETCH_SRC_OF_FUNDS,
                    context: "sourceofFundList",
                },
                {
                    data: data.data.pickListMap
                        .FETCH_MARKET_CAMPAIGN_REFERENCES,
                    context: "marketingCampaignList",
                },
                {
                    data: data.data.pickListMap.FETCH_REASON_REFERENCES,
                    context: "openingReasonList",
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

    const fetchCustomerTypes = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            category: "FETCH_CUSTOMER_TYPES_BY_CUST_CATOGORY",
            subCategory: sessionStorage.getItem("custCat"),
        };
        const data = await picklistMutation.mutateAsync(payload);
        if (data.status === 200) {
            let pickListMap = [
                {
                    data: data.data.pickListMap
                        .FETCH_CUSTOMER_TYPES_BY_CUST_CATOGORY,
                    context: "customerTypeList",
                },
            ];
            // eslint-disable-next-line array-callback-return
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
        setIsLoading(CustomerData.loading);
    }, [CustomerData.loading]);

    useEffect(() => {
        if (!(sessionStorage.getItem("dbsCustApplId") === null)) {
            populateCustomerDraft();
        } else {
            setCustomerData((prev) => ({
                ...prev,
                basicInfoData: {
                    ...prev.basicInfoData,
                    email: sessionStorage.getItem("email"),
                    mobile: sessionStorage.getItem("mobile"),
                },
            }));
        }
        fetchPicklistData();
        fetchCustomerTypes();
    }, []);

    useEffect(() => {
        if (sessionStorage.getItem("dbsCustApplId") === null) {
            setCustomerData((prev) => ({
                ...prev,
                customerCategory: sessionStorage.getItem("custCat"),
            }));
        }
    }, [CustomerData.customerCategory]);

    const componentValidation = (param: any) => {
        const data = [
            basicInfoValidationRef,
            addressInfoValidationRef,
            otherInfoValidationRef,
        ];
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
            currentStep === 3 ||
            currentStep === 4
        ) {
            setCurrentStep((prev) => prev + 1);
        } else {
            const isValid = componentValidation(currentStep);
            if (isValid) {
                const payload = {
                    instituteCode: sessionStorage.getItem("instituteCode"),
                    transmissionTime: Date.now(),
                    ...CustomerData.basicInfoData,
                    ...CustomerData.addressInfoData,
                    ...CustomerData.otherInfoData,
                    identificationsList: CustomerData.identificationInfoData,
                    dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
                    customerCategory: CustomerData.customerCategory,
                    email: sessionStorage.getItem("email"),
                    mobile: sessionStorage.getItem("mobile"),
                    dbsCustApplId: sessionStorage.getItem("dbsCustApplId")
                        ? Number(sessionStorage.getItem("dbsCustApplId"))
                        : null,
                    strphotoGraphImage: CustomerData.strphotoGraphImage,
                    strsignatureImage: CustomerData.strsignatureImage,
                };
                setIsLoading(true);
                const data = await createCustomerDraftMutation.mutateAsync(
                    payload
                );

                if (data.status === 200) {
                    setIsLoading(false);
                    sessionStorage.setItem(
                        "dbsCustApplId",
                        data.data.dbsCustApplId
                    );

                    if (
                        !(
                            sessionStorage.getItem("customerDraftFlag") ===
                            "true"
                        )
                    ) {
                        sessionStorage.setItem("customerDraftFlag", "true");
                        setCustomerData((prev) => ({
                            ...prev,
                            customerDraftFlag: true,
                        }));
                    }

                    setCurrentStep((prev) => prev + 1);
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
                    }, 3000);
                } else {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "error",
                        msgtitle: "",
                        msgDesc: data.errorMessage,
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                }
            }
        }
    };

    const replaceNonNumeric = (value: any) => {
        if (typeof value === "string") {
            // Use regular expression to replace non-numeric characters with empty string
            return value.replace(/[^\d.]/g, ""); // This pattern matches any character that is not a digit or a dot
        } else {
            return value;
        }
    };

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();

        const monthlyIncomeAmount = parseFloat(
            replaceNonNumeric(CustomerData.otherInfoData?.monthlyIncomeAmount)
        );

        const payload = {
            instituteCode: sessionStorage.getItem("instituteCode"),
            transmissionTime: Date.now(),
            ...CustomerData.basicInfoData,
            ...CustomerData.addressInfoData,
            ...CustomerData.otherInfoData,
            monthlyIncomeAmount,
            identificationsList: CustomerData.identificationInfoData,
            dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
            customerCategory: CustomerData.customerCategory,
            email: sessionStorage.getItem("email"),
            mobile: sessionStorage.getItem("mobile"),
            dbsCustApplId: Number(sessionStorage.getItem("dbsCustApplId")),
            strphotoGraphImage: CustomerData.strphotoGraphImage,
            strsignatureImage: CustomerData.strsignatureImage,
        };
        setIsLoading(true);
        const data = await createDBSCustomerMutation.mutateAsync(payload);

        if (data.status === 200) {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: "success",
                msgtitle: "Success ",
                msgDesc: "Customer Created SuccessFully",
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
            }, 3000);
        } else {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: "error",
                msgtitle: "",
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
                <div className={"main-heading"}>Customer Onboarding</div>
                <section className={styles["customer-type-content"]}>
                    <form onSubmit={handleFormSubmit}>
                        <>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: "#006c33",
                                    },
                                }}
                            >
                                <Steps
                                    current={currentStep}
                                    items={stepsList}
                                />
                            </ConfigProvider>
                        </>
                        <div className={styles["form-box"]}>
                            {currentStep === 0 ? (
                                <BasicInfo ref={basicInfoValidationRef} />
                            ) : currentStep === 1 ? (
                                <AddressInfo ref={addressInfoValidationRef} />
                            ) : currentStep === 2 ? (
                                <OtherInfo ref={otherInfoValidationRef} />
                            ) : currentStep === 3 ? (
                                <KycList />
                            ) : currentStep === 4 ? (
                                <DocumentList />
                            ) : currentStep === 5 ? (
                                <ImageInfo />
                            ) : (
                                ""
                            )}
                        </div>
                        <div className={styles["buton-container"]}>
                            {currentStep === 0 &&
                            sessionStorage.getItem("customerDraftFlag") ? (
                                <div></div>
                            ) : (
                                <Button
                                    text={"Back"}
                                    type={"button"}
                                    disabled={false}
                                    buttonType={"back"}
                                    icon={true}
                                    onClick={() => {
                                        currentStep !== 0
                                            ? setCurrentStep((prev) => prev - 1)
                                            : navigate(
                                                  "/dashboard/customerType"
                                              );
                                        setCustomerData((prev) => ({
                                            ...prev,
                                            addDocumentFlag: false,
                                        }));
                                    }}
                                />
                            )}
                            {currentStep === stepsList.length - 1 &&
                            !CustomerData.customerDraftReadOnlyFlag ? (
                                <div className={styles["submit"]}>
                                    <Button
                                        text={"Submit"}
                                        type={"button"}
                                        disabled={
                                            !Boolean(
                                                CustomerData.strphotoGraphImage &&
                                                    CustomerData.strsignatureImage
                                            )
                                            // ||
                                            // !(
                                            //     verificationPassed.bvnVerified ===
                                            //         true &&
                                            //     verificationPassed.ninVerified ===
                                            //         true
                                            // )
                                        }
                                        buttonType={""}
                                        onClick={handleCreateCustomer}
                                    />
                                </div>
                            ) : (
                                ""
                            )}
                            {currentStep === stepsList.length - 1 ||
                            CustomerData.addDocumentFlag ? (
                                ""
                            ) : (
                                <Button
                                    text={"Next"}
                                    type={"submit"}
                                    disabled={false}
                                    buttonType={"next"}
                                    icon={true}
                                />
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
};

export default CreateCustomer;
