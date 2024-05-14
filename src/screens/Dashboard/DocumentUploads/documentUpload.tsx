import React, { useEffect, useState } from "react";
import styles from "./documentUpload.module.css";
import CustomButton from "../../../components/Button/Button";
import { Button, ConfigProvider, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import PaperClipOutlined from "@ant-design/icons/lib/icons/PaperClipOutlined";

export const DocumentUpload = () => {
    const { CustomerData, setCustomerData } = useCustomerContext();
    const [previewFile, setPreviewFile] = useState<any>();
    const [alreadyPhotoFile, setAlreadyPhotoFile] = useState<any>(false);
    const [alreadySignFile, setAlreadySignFile] = useState<any>(false);

    // useEffect(() => {
    //     if (CustomerData.strphotoGraphImage) {
    //         setPreviewPhotoFile(
    //             `data:image/jpeg;base64,${CustomerData?.strphotoGraphImage}`
    //         );
    //     }
    //     if (CustomerData.strsignatureImage) {
    //         setPreviewSignFile(
    //             `data:image/jpeg;base64,${CustomerData.strsignatureImage}`
    //         );
    //     }
    // }, []);

    const uploadPhotographprops = {
        onRemove: () => {
            setPreviewFile("");
            setAlreadyPhotoFile(false);
            setCustomerData((prev) => ({
                ...prev,
                strphotoGraphImage: null,
            }));
        },

        beforeUpload: (file: any) => {
            setPreviewFile(URL.createObjectURL(file));
            setAlreadyPhotoFile(true);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if (reader.result != null) {
                    setCustomerData((prev) => ({
                        ...prev,
                        strphotoGraphImage: reader.result
                            ?.toString()
                            .split(",")[1],
                    }));
                }
            };
            return false;
        },
    };

    const uploadSignatureprops = {
        onRemove: () => {
            setPreviewFile("");
            setAlreadySignFile(false);
            setCustomerData((prev) => ({
                ...prev,
                strsignatureImage: null,
            }));
        },

        beforeUpload: (file: any) => {
            setPreviewFile(URL.createObjectURL(file));
            setAlreadySignFile(true);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                if (reader.result != null) {
                    setCustomerData((prev) => ({
                        ...prev,
                        strsignatureImage: reader.result
                            ?.toString()
                            .split(",")[1],
                    }));
                }
            };
            return false;
        },
    };

    return (
        <div className={styles["image-container"]}>
            <div className={styles["image-input-main-container"]}>
                <div className={styles["image-input-container"]}>
                    <p className={styles["image-input-text"]}>
                        Document Upload
                    </p>
                    <div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#39C594",
                                },
                            }}
                        >
                            <Upload
                                {...uploadPhotographprops}
                                multiple={false}
                                maxCount={1}
                                accept={".pdf"}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    style={{ width: "100%" }}
                                    disabled={
                                        CustomerData.customerDraftReadOnlyFlag
                                    }
                                >
                                    Select File
                                </Button>
                            </Upload>
                        </ConfigProvider>
                        <p
                            className={styles["selectFileheader"]}
                            style={{ marginTop: "8px" }}
                        >
                            {!alreadyPhotoFile &&
                            CustomerData.strphotoGraphImage ? (
                                <>
                                    <PaperClipOutlined /> {"1 file(s)"}
                                </>
                            ) : (
                                ""
                            )}
                        </p>
                    </div>

                    <CustomButton
                        text={"Preview"}
                        type={"button"}
                        onClick={() => {
                            setPreviewFile(previewFile);
                        }}
                    />
                </div>
                <div className={styles["image-input-container"]}>
                    <p className={styles["image-input-text"]}>
                        {" "}
                        Document Upload
                    </p>
                    <div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#39C594",
                                },
                            }}
                        >
                            <Upload
                                {...uploadSignatureprops}
                                multiple={false}
                                maxCount={1}
                                accept={".pdf"}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    style={{ width: "100%" }}
                                    disabled={
                                        CustomerData.customerDraftReadOnlyFlag
                                    }
                                >
                                    Select File
                                </Button>
                            </Upload>
                        </ConfigProvider>
                        <p
                            className={styles["selectFileheader"]}
                            style={{ marginTop: "8px" }}
                        >
                            {!alreadySignFile &&
                            CustomerData.strsignatureImage ? (
                                <>
                                    <PaperClipOutlined /> {"1 file(s)"}
                                </>
                            ) : (
                                ""
                            )}
                        </p>
                    </div>
                    <CustomButton
                        text={"Preview"}
                        type={"button"}
                        onClick={() => {
                            setPreviewFile(previewFile);
                        }}
                    />
                </div>
            </div>
            <div
                className={
                    previewFile
                        ? styles["image-preview-container-background-white"]
                        : styles["image-preview-container-background-black"]
                }
            >
                {previewFile && (
                    <div className={styles["view-pdf"]}>
                        <iframe
                            title='uploadPdf1'
                            src={previewFile}
                            width={"900px"}
                        />
                    </div>
                )}
            </div>
            <div className={styles["upload-button"]}>
                <CustomButton
                    text={"upLoad"}
                    type={"button"}
                    onClick={() => {
                        setPreviewFile(previewFile);
                    }}
                />
            </div>
        </div>
    );
};
