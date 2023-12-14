import React, { useState } from "react";
import ChangePasswordIcon from "../../assets/icons/ChangePassword.svg";
import styles from "./profile.module.css";
import InputField from "../../components/InputFiled/InputField";
import Button from "../../components/Button/Button";
import passwordIcon from "../../assets/icons/password.png";
import repeat from "../../assets/icons/repeat.png";
import { useNavigate } from "react-router-dom";
import {
  PasswordRequest,
  useUpdateUserProfile,
} from "../ForgotPassword/forgotpasswordService";
import { password_regex } from "../../Utils/Constants/constants";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import { notification } from "antd";
import SimpleReactValidator from "simple-react-validator";

export const ChangePassword = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const mutaion = useUpdateUserProfile();
  const [api, contextHolder] = notification.useNotification();
  const [passwordData, setPasswordData] = useState({
    currentPwd: "",
    newPwd: "",
    confirmPwd: "",
  });

  const [, forceUpdate] = useState({});

  const handleProfileData = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordData.newPwd === passwordData.confirmPwd) {
      const profileData = {
        dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
        failedLoginNo: 0,
        password: passwordData.confirmPwd,
        oldPassword: passwordData.currentPwd,
      };
      setIsLoading(true);
      const response = await props.updateProfile(profileData);
      if (response) {
        setIsLoading(false);
      }
    } else {
      const notificationData: CommonnotificationProps = {
        type: "error",
        msgtitle: "Error",
        msgDesc:
          "Password and Confirm Password do not match. Please ensure they are the same",
        api: api,
      };
      openNotificationWithIcon(notificationData);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles["main"]}>
        <div className={styles["password-header"]}>Change Password</div>
        <form className={styles["password-form"]} onSubmit={changePassword}>
          <div>
            <InputField
              image={passwordIcon}
              placeholder={"Current Password"}
              type={"password"}
              required={true}
              value={passwordData.currentPwd}
              name="currentPwd"
              onChange={handleProfileData}
            />
          </div>
          <div>
            <InputField
              image={passwordIcon}
              placeholder={"New Password"}
              type={"password"}
              required={true}
              value={passwordData.newPwd}
              name="newPwd"
              onChange={handleProfileData}
              pattern={password_regex}
              title={
                "Password should not be less than 8 characters and it should contain at least one number and one letter"
              }
            />
          </div>
          <div>
            <InputField
              image={repeat}
              placeholder={"Repeat Password"}
              type={"password"}
              required={true}
              value={passwordData.confirmPwd}
              name="confirmPwd"
              onChange={handleProfileData}
              pattern={password_regex}
              title={
                "Password should not be less than 8 characters and it should contain at least one number and one letter"
              }
            />
          </div>
          <Button
            text={"Reset Password"}
            type={"submit"}
            open={isLoading}
            disabled={isLoading}
          />
        </form>
      </div>
    </>
  );
};
