import React, { useState, useContext, useEffect } from "react";
import styles from "../../createCustomer.module.css";
import InputField from "../../../../components/InputFiled/InputField";
import CustomSelector from "../../../../components/CustomSelector/customSelector";
import { Button, ConfigProvider, notification, Upload } from "antd";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import CustomDatePicker from "../../../../components/CustomDatePicker/customDatePicker";
import CustomButton from "../../../../components/Button/Button";
import {
    useCreateCustomerDraft,
    useGetPicklist,
} from "../../createCustomerService";
import SimpleReactValidator from "simple-react-validator";
import { usePickListContext } from "../../../../context/pickListDataContext";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../../components/Notification/commonnotification";
import { useNavigate } from "react-router-dom";
import usePopulateCustomerDraft from "../../../../Hooks/populateCustomerDraft";
import PaperClipOutlined from "@ant-design/icons/lib/icons/PaperClipOutlined";
import Loader from "../../../../components/Loader/loader";
import DialogueBox, {
    DialogueBoxProps,
} from "../../../../components/Model/model";
import { identificationInfoProps } from "../../../../interfaces";

const KycInfo: React.FC<any> = (props: any) => {
    const [validator] = useState(new SimpleReactValidator());
    const { CustomerData, setCustomerData } = useCustomerContext();
    const picklistMutation = useGetPicklist();
    const [identityTypes, setIdentityTypes] = useState<any>();
    const [kycData, setkycData] = useState<identificationInfoProps>({
        binaryImage: "",
        countryOfIssueId: null,
        identityNumber: "",
        identityTypeCd: "",
        identityTypeDesc: "",
        strExpiryDate: "",
        strIssueDate: "",
    });
    const { picklistData, setPicklistData } = usePickListContext();
    const createCustomerDraftMutation = useCreateCustomerDraft();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const { populateCustomerDraft } = usePopulateCustomerDraft();
    const [isLoading, setIsLoading] = useState(false);
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
        if (props.identityData?.data) {
            setkycData({
                binaryImage: props.identityData.data.binaryImage,
                countryOfIssueId:
                    props.identityData.data.countryOfIssueId.toString(),
                identityNumber: props.identityData.data.identityNumber,
                identityTypeCd: props.identityData.data.identityTypeCd,
                identityTypeDesc: props.identityData.data.identityTypeDesc,
                strExpiryDate: props.identityData.data.strExpiryDate,
                strIssueDate: props.identityData.data.strIssueDate,
            });
        }
    }, [props.identityData]);

    const handleIdentityInfo = ({
        target: { value, name },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setkycData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelector = (
        value: React.MouseEvent<Element, MouseEvent>,
        option: any,
        optionName: any,
        name: string
    ) => {
        if (option) {
            setkycData((prev) => ({
                ...prev,
                [optionName]: value,
            }));
        }
        setkycData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const uploadprops: UploadProps = {
        onRemove: (file) => {},

        beforeUpload: (file) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                setkycData((prev) => ({
                    ...prev,
                    binaryImage: reader.result
                        ? reader.result?.toString().split(",")[1]
                        : "",
                }));
            };
            return false;
        },
    };

    useEffect(() => {
        setCustomerData((prev) => ({
            ...prev,
            addDocumentFlag: true,
        }));
        fetPicklistData();
        return () => {
            setCustomerData((prev) => ({
                ...prev,
                addDocumentFlag: false,
            }));
        };
    }, []);

    const fetPicklistData = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            category: "FETCH_CUSTOMER_IDENTIFICATION_XREF",
            subCategory: CustomerData.basicInfoData.customerType,
        };
        const data: any = await picklistMutation.mutateAsync(payload);
        if (data.status === 200) {
            if (data.data?.pickListMap.FETCH_CUSTOMER_IDENTIFICATION_XREF) {
                let temp: { value: any; label: any }[] = [];
                data.data.pickListMap.FETCH_CUSTOMER_IDENTIFICATION_XREF?.map(
                    (data: { listKey: any; listDesc: any }) => {
                        temp.push({
                            value: data.listKey,
                            label: data.listDesc,
                        });
                    }
                );
                setIdentityTypes(temp);
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

    const [, forceUpdate] = useState({});

    const handleIdentification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validator.allValid()) {
            let arr;

            if (CustomerData.identificationInfoData) {
                if (props.identityData) {
                    let temp = CustomerData.identificationInfoData;
                    temp.splice(props.identityData?.index, 1);
                    if (temp.length > 0) {
                        arr = [...temp, kycData];
                    } else {
                        arr = [kycData];
                    }
                } else {
                    arr = [...CustomerData.identificationInfoData, kycData];
                }
            } else {
                arr = [kycData];
            }
            const payload = {
                instituteCode: sessionStorage.getItem("instituteCode"),
                transmissionTime: Date.now(),
                ...CustomerData.basicInfoData,
                ...CustomerData.addressInfoData,
                ...CustomerData.otherInfoData,
                identificationsList: arr,
                dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
                customerCategory: CustomerData.customerCategory,
                email: sessionStorage.getItem("email"),
                mobile: sessionStorage.getItem("mobile"),
                dbsCustApplId: Number(sessionStorage.getItem("dbsCustApplId")),
                strphotoGraphImage: CustomerData.strphotoGraphImage,
                strsignatureImage: CustomerData.strsignatureImage,
            };
            setIsLoading(true);
            const data = await createCustomerDraftMutation.mutateAsync(payload);

            if (data.status === 200) {
                setIsLoading(false);
                const notificationData: CommonnotificationProps = {
                    type: "success",
                    msgtitle: "success",
                    msgDesc: "Identification Date Successfully added",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                if (props.setIdentityData) {
                    props.setIdentityData();
                }
                setCustomerData((prev) => ({
                    ...prev,
                    addDocumentFlag: false,
                }));
                populateCustomerDraft();
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
        } else {
            validator.showMessages();
            forceUpdate({});
        }
    };

    const handleDeleteIdentification = (e: React.FormEvent) => {
        e.preventDefault();
        setModelOpen(true);
        setModelData({
            title: "Confirmation",
            content: "Are you sure, you want to delete the Identification ?",
            okText: "Delete",
            cancelText: "Cancel",
            onOk: async () => {
                setModelOpen(false);
                let arr;
                let temp = CustomerData.identificationInfoData.splice(
                    props.identityData?.index,
                    1
                );
                if (temp.length > 0) {
                    arr = [...CustomerData.identificationInfoData];
                } else {
                    arr = null;
                }
                const payload = {
                    instituteCode: sessionStorage.getItem("instituteCode"),
                    transmissionTime: Date.now(),
                    ...CustomerData.basicInfoData,
                    ...CustomerData.addressInfoData,
                    ...CustomerData.otherInfoData,
                    identificationsList: arr,
                    dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
                    customerCategory: CustomerData.customerCategory,
                    email: sessionStorage.getItem("email"),
                    mobile: sessionStorage.getItem("mobile"),
                    dbsCustApplId: Number(
                        sessionStorage.getItem("dbsCustApplId")
                    ),
                    strphotoGraphImage: CustomerData.strphotoGraphImage,
                    strsignatureImage: CustomerData.strsignatureImage,
                };
                setIsLoading(true);
                const data = await createCustomerDraftMutation.mutateAsync(
                    payload
                );

                if (data.status === 200) {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "success",
                        msgtitle: "success",
                        msgDesc: "Identification Successfully Deleted",
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                    if (props.identityData) {
                        props.setIdentityData();
                    }
                    sessionStorage.setItem(
                        "dbsCustApplId",
                        data.data?.dbsCustApplId
                    );
                    populateCustomerDraft();
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
            },
            onCancel: true,
        });
    };

    return (
        <>
            {contextHolder}
            <Loader loading={isLoading} />
            <DialogueBox
                open={modelOpen}
                DialogueBoxProps={modelData}
                setOpen={setModelOpen}
            />
            <div className={styles["basic-info-container"]}>
                <div className={styles["input-container-split"]}>
                    <div>
                        <CustomSelector
                            label={"Identity Type"}
                            onChange={(e, option) => {
                                handleSelector(
                                    e,
                                    option,
                                    "identityTypeDesc",
                                    "identityTypeCd"
                                );
                            }}
                            optionsList={identityTypes}
                            value={kycData.identityTypeCd}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "identityNumber",
                                kycData.identityTypeCd,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["input-container-split"]}>
                    <div className={styles["input-container"]}>
                        <InputField
                            label={"Identity Number"}
                            type={"text"}
                            required={true}
                            onChange={handleIdentityInfo}
                            value={kycData.identityNumber}
                            name='identityNumber'
                        />
                        <span className='text-error'>
                            {validator.message(
                                "identityNumber",
                                kycData.identityNumber,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div>
                        <CustomSelector
                            label={"Country Of Issue"}
                            onChange={(e) =>
                                handleSelector(e, "", "", "countryOfIssueId")
                            }
                            optionsList={picklistData.countryList}
                            value={kycData.countryOfIssueId}
                            name='countryOfIssueId'
                        />
                        <span className='text-error'>
                            {validator.message(
                                "countryOfIssueId",
                                kycData.countryOfIssueId,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["input-container-split"]}>
                    <div>
                        <CustomDatePicker
                            label={"Issue Date"}
                            value={kycData.strIssueDate}
                            onChange={(date: any, dateString: any) => {
                                setkycData((prev) => ({
                                    ...prev,
                                    strIssueDate: dateString,
                                }));
                            }}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "Issue",
                                kycData.strIssueDate,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <div className={styles["input-container-split"]}>
                    <div>
                        <CustomDatePicker
                            value={kycData.strExpiryDate}
                            onChange={(date: any, dateString: any) => {
                                setkycData((prev) => ({
                                    ...prev,
                                    strExpiryDate: dateString,
                                }));
                            }}
                            label={"Expiry Date"}
                            name={"ExpiryDate"}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "ExpiryDate",
                                kycData.strExpiryDate,
                                "required"
                            )}
                        </span>
                    </div>
                </div>

                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#39C594",
                        },
                    }}
                >
                    <div className={styles["input-container-split"]}>
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <p className={styles["label"]}>
                                    Select file to Upload
                                </p>
                                <p className={styles["selectFileheader"]}>
                                    {props.identityData?.data?.binaryImage ? (
                                        <>
                                            <PaperClipOutlined /> {"1 file(s)"}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </p>
                            </div>
                            <Upload
                                {...uploadprops}
                                multiple={false}
                                maxCount={1}
                                accept={".pdf"}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    style={{ width: "100%", margin: "10px 0" }}
                                    name={"binaryImage"}
                                >
                                    Select File
                                </Button>
                            </Upload>
                            <span className='text-error'>
                                {validator.message(
                                    "binaryImage",
                                    kycData.binaryImage,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                </ConfigProvider>
            </div>
            <div className={styles["button-Outer-Container"]}>
                <div className={styles["button-Container"]}>
                    <div className={styles["save-button"]}>
                        <CustomButton
                            text={"Save Identification"}
                            type='button'
                            onClick={handleIdentification}
                        />
                    </div>
                    <div className={styles["delete-button"]}>
                        {props.identityData?.data ? (
                            <CustomButton
                                text={"Delete Identification"}
                                type='button'
                                onClick={handleDeleteIdentification}
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
                                props.setIdentityData();
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default KycInfo;
