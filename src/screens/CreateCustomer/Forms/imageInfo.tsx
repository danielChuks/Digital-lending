import React, { useEffect, useRef, useState } from "react";
import styles from "../createCustomer.module.css";
import CustomButton from "../../../components/Button/Button";
import { Button, ConfigProvider, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import PaperClipOutlined from "@ant-design/icons/lib/icons/PaperClipOutlined";

const ImageInfo = () => {
    const { CustomerData, setCustomerData } = useCustomerContext();
    const [previewFile, setPreviewFile] = useState<any>();
    const [previewPhotoFile, setPreviewPhotoFile] = useState<any>();
    const [previewSignFile, setPreviewSignFile] = useState<any>();
    const [alreadyPhotoFile, setAlreadyPhotoFile] = useState<any>(false);
    const [alreadySignFile, setAlreadySignFile] = useState<any>(false);
    const [stream, setStream] = useState<MediaStream | null>(null); // State to hold the webcam stream
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (CustomerData.strphotoGraphImage) {
            setPreviewPhotoFile(
                `data:image/jpeg;base64,${CustomerData?.strphotoGraphImage}`
            );
        }
        if (CustomerData.strsignatureImage) {
            setPreviewSignFile(
                `data:image/jpeg;base64,${CustomerData.strsignatureImage}`
            );
        }
    }, []);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setStream(stream); // Store the stream in state
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas?.getContext("2d");

            // Draw the video frame onto the canvas
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert the canvas to a data URL representing the captured image
            const dataURL = canvas.toDataURL("image/png");

            // Set the captured image in state
            setPreviewFile(dataURL);
        }
    };

    const uploadPhotographprops = {
        onRemove: () => {
            setPreviewPhotoFile("");
            setCustomerData((prev) => ({
                ...prev,
                strphotoGraphImage: null,
            }));
            if (previewFile === previewPhotoFile) {
                setPreviewFile("");
            }
        },

        beforeUpload: (file: any) => {
            setPreviewPhotoFile(URL.createObjectURL(file));
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
            setPreviewSignFile("");
            setCustomerData((prev) => ({
                ...prev,
                strsignatureImage: null,
            }));
            if (previewFile === previewSignFile) {
                setPreviewFile("");
            }
        },

        beforeUpload: (file: any) => {
            setPreviewSignFile(URL.createObjectURL(file));
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
                    <p className={styles["image-input-text"]}>Photograph</p>
                    <div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#39C594",
                                },
                            }}
                        >
                            <video
                                style={{ height: "200px" }}
                                ref={videoRef}
                                autoPlay
                            />
                            {stream ? (
                                <Button
                                    style={{ alignItems: "center" }}
                                    onClick={stopWebcam}
                                >
                                    Stop Camera
                                </Button>
                            ) : (
                                <Button onClick={startWebcam}>
                                    Start Camera
                                </Button>
                            )}
                        </ConfigProvider>
                        <CustomButton
                            text={"Capture"}
                            type={"button"}
                            onClick={handleCapture}
                            disabled={!stream}
                        />
                    </div>
                </div>

                <div className={styles["image-input-container"]}>
                    <p className={styles["image-input-text"]}>Signature</p>
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
                                accept={".png"}
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
                            setPreviewFile(previewSignFile);
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
                <img
                    src={previewFile}
                    className={styles["image-preview-section"]}
                ></img>
            </div>
        </div>
    );
};

export default ImageInfo;
