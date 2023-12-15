import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, message, notification, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import styles from "./profile.module.css";
import InputField from "../../components/InputFiled/InputField";
import CustomDatePicker from "../../components/CustomDatePicker/customDatePicker";
import Button from "../../components/Button/Button";
import EditIcon from "../../assets/icons/editIcon.png";
import SimpleReactValidator from "simple-react-validator";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    userProfileImage: "",
    birthDate: "",
};

const ViewProfile = (props: any) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>();
    const [validator] = useState(new SimpleReactValidator());
    const [profileData, setProfileData] = useState(initialValues);
    const [, forceUpdate] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        if (props.profileInfoData) {
            setProfileData((prev) => ({
                ...prev,
                firstName: props.profileInfoData?.firstName,
                lastName: props.profileInfoData?.lastName,
                email: props.profileInfoData?.email,
                mobile: props.profileInfoData?.mobile,
                userProfileImage: props.profileInfoData?.userProfileImage,
                birthDate: props.profileInfoData?.birthDate,
            }));
            setImageUrl(
                props.profileInfoData?.userProfileImage
                    ? `data:image/jpeg;base64,${props.profileInfoData?.userProfileImage}`
                    : null
            );
        }
    }, [props.profileInfoData]);

    const handleProfileData = ({
        target: { value, name },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveProfile = async () => {
        if (validator.allValid()) {
            setIsLoading(true);
            const response = await props.updateProfile(profileData);
            if (response) {
                setIsLoading(false);
            }
        } else {
            validator.showMessages();
            forceUpdate({});
        }
    };

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        getBase64(file as RcFile, (url) => {
            setProfileData((prev) => ({
                ...prev,
                userProfileImage: url.toString().split(",")[1],
            }));
            setImageUrl(url);
        });
    };

    return (
        <>
            {contextHolder}
            <div className={styles["profile-container"]}>
                <div className={styles["profile-left-container"]}>
                    <div className={styles["profile-icon-container"]}>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#3AC793",
                                },
                            }}
                        >
                            <ImgCrop rotationSlider>
                                <Upload
                                    name='avatar'
                                    listType='picture-circle'
                                    className='avatar-uploader'
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={customRequest}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt='avatar'
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                            }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </ImgCrop>
                        </ConfigProvider>
                    </div>
                    <img
                        src={EditIcon}
                        alt='editIcon'
                        className={styles["profile-edit-icon"]}
                    />
                </div>
                <div className={styles["profile-right-container"]}>
                    <p>{profileData.firstName + " " + profileData.lastName}</p>
                    <p>{profileData.email}</p>
                </div>
            </div>
            <div className={styles["profile-input-container"]}>
                <div className={styles["profile-input-field"]}>
                    <p>First Name</p>
                    <div>
                        <InputField
                            type={"text"}
                            name='firstName'
                            onChange={handleProfileData}
                            value={profileData.firstName}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "firstName",
                                profileData.firstName,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["profile-input-field"]}>
                    <p>Last Name</p>
                    <div>
                        <InputField
                            type={"text"}
                            name='lastName'
                            onChange={handleProfileData}
                            value={profileData.lastName}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "lastName",
                                profileData.lastName,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["profile-input-field"]}>
                    <p>Date of Birth</p>
                    <div>
                        <CustomDatePicker
                            value={profileData.birthDate}
                            onChange={(date: any, dateString: any) => {
                                setProfileData((prev) => ({
                                    ...prev,
                                    birthDate: dateString,
                                }));
                            }}
                        />
                        <span className='text-error'>
                            {validator.message(
                                "lastName",
                                profileData.birthDate,
                                "required"
                            )}
                        </span>
                    </div>
                </div>
                <div className={styles["profile-input-field"]}>
                    <p>Mobile</p>
                    <InputField
                        type={"text"}
                        name='mobile'
                        onChange={handleProfileData}
                        value={profileData.mobile}
                        readonly={true}
                    />
                </div>
                <div className={styles["profile-input-field"]}>
                    <p>Email</p>
                    <InputField
                        type={"text"}
                        name='email'
                        onChange={handleProfileData}
                        value={profileData.email}
                        readonly={true}
                    />
                </div>
            </div>
            <div className={styles["button-container"]}>
                <Button
                    text={"Save Changes"}
                    type={"button"}
                    onClick={saveProfile}
                    open={isLoading}
                    disabled={isLoading}
                />
            </div>
        </>
    );
};

export default ViewProfile;
