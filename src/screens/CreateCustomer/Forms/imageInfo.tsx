import React, { useEffect, useState } from "react";
import styles from "../createCustomer.module.css";
import CustomButton from "../../../components/Button/Button";
import {
  Button,
  ConfigProvider,
  Upload,
} from "antd";
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

  useEffect(() => {
    if (CustomerData.strphotoGraphImage) {
      setPreviewPhotoFile(`data:image/jpeg;base64,${CustomerData?.strphotoGraphImage}`);
    }
    if (CustomerData.strsignatureImage) {
      setPreviewSignFile(`data:image/jpeg;base64,${CustomerData.strsignatureImage}`);
    }
  }, []);

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
            strphotoGraphImage: reader.result?.toString().split(",")[1],
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
            strsignatureImage: reader.result?.toString().split(",")[1],
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
              <Upload
                {...uploadPhotographprops}
                multiple={false}
                maxCount={1}
                accept={".png"}
              >
                <Button icon={<UploadOutlined />} style={{ width: "100%" }} disabled={CustomerData.customerDraftReadOnlyFlag}>
                  Select File
                </Button>
              </Upload>
            </ConfigProvider>
            <p
              className={styles["selectFileheader"]}
              style={{ marginTop: "8px" }}
            >
              {!alreadyPhotoFile  && CustomerData.strphotoGraphImage ? (
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
              setPreviewFile(previewPhotoFile);
            }}
          />
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
                <Button icon={<UploadOutlined />} style={{ width: "100%" }} disabled={CustomerData.customerDraftReadOnlyFlag}>
                  Select File
                </Button>
              </Upload>
            </ConfigProvider>
            <p
              className={styles["selectFileheader"]}
              style={{ marginTop: "8px" }}
            >
              {!alreadySignFile && CustomerData.strsignatureImage? (
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
