import React, { useState, useEffect } from "react";
import styles from "../../createCustomer.module.css";
import InputField from "../../../../components/InputFiled/InputField";
import CustomSelector from "../../../../components/CustomSelector/customSelector";
import { Button, ConfigProvider, notification, Upload } from "antd";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "../../../../components/Button/Button";
import {
    useCreateCustomerDocument,
    useGetPicklist,
    useModifyCustomerDocument,
    useRemoveCustomerDocument,
} from "../../createCustomerService";
import SimpleReactValidator from "simple-react-validator";
import Loader from "../../../../components/Loader/loader";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../../components/Notification/commonnotification";
import { useNavigate } from "react-router-dom";
import usePopulateCustomerDraft from "../../../../Hooks/populateCustomerDraft";
import PaperClipOutlined from "@ant-design/icons/lib/icons/PaperClipOutlined";
import DialogueBox, {
    DialogueBoxProps,
} from "../../../../components/Model/model";
import { DocumentListInfoProps } from "../../../../interfaces/documentListInfoProps.interface";

const DocumentInfo: React.FC<any> = (props: any) => {
    const [validator] = useState(new SimpleReactValidator());
    const { CustomerData, setCustomerData } = useCustomerContext();
    const picklistMutation = useGetPicklist();
    const [documentTypes, setDocumentTypes] = useState<any>();
    const [, forceUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { populateCustomerDraft } = usePopulateCustomerDraft();
    const createCustomerDocumentMutation = useCreateCustomerDocument();
    const modifyCustomerDocumentMutation = useModifyCustomerDocument();
    const removeCustomerDocumentMutation = useRemoveCustomerDocument();
    const [documentData, setDocumentData] = useState<DocumentListInfoProps>({
        binaryDocument: "",
        docFileName: "",
        docTypeDesc: "",
        docExt: "",
        docFileExt: "",
        docId: null,
        docRef: "",
        docTypeId: "",
        docDesc: "",
    });
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [byteArray, setByteArray] = useState<Uint8Array | null | any>(null);
    const [documentExtensions, setdocumentExtensions] = useState<any>();
    const [acceptFileTypes, setAcceptFileTypes] = useState<any>();
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
        if (props?.docData) {
            setDocumentData({
                docFileName: props?.docData?.docFileName,
                docTypeDesc: props?.docData?.documentTypeDescription,
                docExt: props?.docData?.documentExtension,
                docFileExt: props?.docData?.docFileExtension,
                docId: props?.docData?.documentId,
                docRef: props?.docData?.documentRefernce,
                docTypeId: props?.docData?.documentType?.toString(),
                docDesc: props?.docData?.documentDescription,
            });
        }
    }, [props?.docData]);

    const handleDocumentInfo = ({
        target: { value, name },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentData((prev) => ({
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
            setDocumentData((prev) => ({
                ...prev,
                [optionName]: option.label,
            }));
        }
        setDocumentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetPicklistData();
        setCustomerData((prev) => ({
            ...prev,
            addDocumentFlag: true,
        }));
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
            category: "FETCH_DOCUMENT_REF",
            subCategory: CustomerData.basicInfoData.customerType,
        };
        const data = await picklistMutation.mutateAsync(payload);

        if (data.data?.pickListMap?.FETCH_DOCUMENT_REF) {
            let temp: { value: any; label: any }[] = [];
            data.data.pickListMap.FETCH_DOCUMENT_REF?.map(
                (data: { listKey: any; listDesc: any }) => {
                    temp.push({
                        value: data.listKey,
                        label: data.listDesc,
                    });
                }
            );
            setDocumentTypes(temp);
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
        if (documentData.docTypeId) {
            fetchDocumentExtensions();
        }
    }, [documentData.docTypeId]);

    const fetchDocumentExtensions = async () => {
        const payload = {
            instituteCode: "DBS01",
            transmissionTime: Date.now(),
            category: "FETCH_DOCUMENT_EXTENTION_REF",
            subCategory: documentData.docTypeId,
        };
        const data = await picklistMutation.mutateAsync(payload);

        if (data.data.pickListMap?.FETCH_DOCUMENT_EXTENTION_REF) {
            let temp: { value: any; label: any }[] = [];
            let array: any[] = [];
            data.data.pickListMap.FETCH_DOCUMENT_EXTENTION_REF?.map(
                (data: { listKey: any; listDesc: any }) => {
                    array.push(data.listDesc);
                    temp.push({
                        value: data.listKey,
                        label: data.listDesc,
                    });
                }
            );
            setdocumentExtensions(temp);
            setAcceptFileTypes(array.toString());
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

    const customRequest = ({ file, onSuccess }: any) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result as ArrayBuffer;
            setByteArray(new Uint8Array(result));
            onSuccess("ok");
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRemove = (file: any) => {
        setFileList([]);
        setByteArray(null);
    };

    const handleChange = (info: any) => {
        if (info.fileList.length === 0) {
            setByteArray(null);
        } else {
            setFileList(info.fileList);
            setDocumentData((prev) => ({
                ...prev,
                docFileName: info.fileList[0]?.name,
            }));

            if (
                info.fileList[0]?.type === "application/pdf" ||
                info.fileList[0]?.type === "application/msword"
            ) {
                setDocumentData((prev) => ({
                    ...prev,
                    docFileExt: "." + info.fileList[0].type.substring(12),
                }));
            }
            if (
                info.fileList[0]?.type === "image/png" ||
                info.fileList[0]?.type === "image/jpeg"
            ) {
                setDocumentData((prev) => ({
                    ...prev,
                    docFileExt:
                        "." +
                        (info.fileList[0]?.type === "image/jpeg"
                            ? "jpg"
                            : info.fileList[0].type?.substring(6)),
                }));
            }
        }
    };

    const findDocumentExtentionId = (param: any) => {
        let temp;
        if (documentExtensions) {
            documentExtensions?.map((data: any) => {
                if (param.toString() === data.label) {
                    temp = data.value;
                }
            });
        }
        return temp;
    };

    const handleSaveDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            props?.docData &&
            props?.docData?.documentType.toString() === documentData.docTypeId
        ) {
            validator.fields.binaryDocument = true;
        }
        if (validator.allValid()) {
            const payload: any = new FormData();

            const stringifyBlob = new Blob([byteArray]);
            payload.append("file", stringifyBlob);

            const json = {
                docFileName: documentData.docFileName,
                docTypeDesc: documentData.docTypeDesc,
                docExt: findDocumentExtentionId(documentData.docFileExt),
                docFileExt: documentData.docFileExt,
                docRef: documentData.docRef,
                docTypeId: documentData.docTypeId,
                docDesc: documentData.docDesc,
                dbsCustApplId: sessionStorage.getItem("dbsCustApplId"),
                dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
                transmissionTime: Date.now(),
                channelCode: "DBS",
                instituteCode: "DBS01",
                channelId: "144",
                docId: documentData.docId ? documentData.docId : null,
            };

            const blob = new Blob([JSON.stringify(json)], {
                type: "application/json",
            });

            payload.append("request", blob);
            setIsLoading(true);

            let data;
            if (props?.docData) {
                data = await modifyCustomerDocumentMutation.mutateAsync(
                    payload
                );
            } else {
                data = await createCustomerDocumentMutation.mutateAsync(
                    payload
                );
            }

            if (data.status === 200) {
                setIsLoading(false);
                const notificationData: CommonnotificationProps = {
                    type: "success",
                    msgtitle: "success",
                    msgDesc: "Document Date Successfully added",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                if (props?.docData) {
                    props.setDocData();
                }
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

    const handleDeleteDocument = (e: React.FormEvent) => {
        e.preventDefault();

        setModelOpen(true);
        setModelData({
            title: "Confirmation",
            content: "Are you sure, you want to delete the Document ?",
            okText: "Delete",
            cancelText: "Cancel",
            onOk: async () => {
                setModelOpen(false);
                const payload = {
                    dbsCustApplId: sessionStorage.getItem("dbsCustApplId"),
                    dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
                    docId: documentData.docId,
                };

                setIsLoading(true);

                const data = await removeCustomerDocumentMutation.mutateAsync(
                    payload
                );

                if (data.status === 200) {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "success",
                        msgtitle: "success",
                        msgDesc: "Document Deleted Successfully ",
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                    if (props?.docData) {
                        props.setDocData();
                    }
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
                <div>
                    <CustomSelector
                        stylesprops={styles.customRequireStyles}
                        label={"Document Type"}
                        onChange={(e, option) => {
                            handleSelector(
                                e,
                                option,
                                "docTypeDesc",
                                "docTypeId"
                            );
                        }}
                        optionsList={documentTypes}
                        value={documentData.docTypeId}
                    />
                    <span className='text-error'>
                        {validator.message(
                            "documentType",
                            documentData.docTypeId,
                            "required"
                        )}
                    </span>
                </div>
                <div className={styles["input-container"]}>
                    <InputField
                        label={"Document Reference"}
                        type={"text"}
                        required={true}
                        onChange={handleDocumentInfo}
                        value={documentData.docRef}
                        name='docRef'
                        styleProps={styles["customRequireStyles"]}
                    />
                    <span className='text-error'>
                        {validator.message(
                            "documentReference",
                            documentData.docRef,
                            "required"
                        )}
                    </span>
                </div>
                <div className={styles["input-container"]}>
                    <InputField
                        label={"Document Description"}
                        type={"text"}
                        required={true}
                        onChange={handleDocumentInfo}
                        value={documentData.docDesc}
                        name='docDesc'
                        styleProps={styles["customRequireStyles"]}
                    />
                </div>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#39C594",
                        },
                    }}
                >
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
                                {props.docData &&
                                !(fileList.length > 0) &&
                                props?.docData?.documentType?.toString() ===
                                    documentData.docTypeId ? (
                                    <>
                                        <PaperClipOutlined /> {"1 file(s)"}
                                    </>
                                ) : (
                                    ""
                                )}
                            </p>
                        </div>
                        <Upload
                            // defaultFileList={[{uid: '1',
                            // name: 'xxx.png',
                            // status: 'done'}]}
                            customRequest={customRequest}
                            fileList={fileList}
                            onRemove={handleRemove}
                            onChange={handleChange}
                            multiple={false}
                            maxCount={1}
                            accept={acceptFileTypes}
                            disabled={!documentData.docTypeId}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{ width: "100%", margin: "15px 0" }}
                            >
                                Select File
                            </Button>
                        </Upload>
                        <span className='text-error'>
                            {validator.message(
                                "binaryDocument",
                                byteArray,
                                "required"
                            )}
                        </span>
                    </div>
                </ConfigProvider>
            </div>
            <div className={styles["button-Outer-Container"]}>
                <div className={styles["button-Container"]}>
                    <div className={styles["save-button"]}>
                        <CustomButton
                            text={"Save Document"}
                            type='button'
                            onClick={handleSaveDocument}
                        />
                    </div>
                    <div className={styles["delete-button"]}>
                        {props?.docData ? (
                            <CustomButton
                                text={"Delete Document"}
                                type='button'
                                onClick={handleDeleteDocument}
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
                                props.setDocData();
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentInfo;
