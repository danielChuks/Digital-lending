import React, { useEffect, useState } from "react";
import ChangePasswordIcon from "../../assets/icons/ChangePassword.svg";
import styles from "./forgotPassword.module.css";
import InputField from "../../components/InputFiled/InputField";
import Button from "../../components/Button/Button";
import password from "../../assets/icons/password.png";
import repeat from "../../assets/icons/repeat.png";
import { useNavigate } from "react-router-dom";
import * as screenNames from "../../Utils/Constants/screennames";
import { PasswordRequest, useUpdateUserProfile } from "./forgotpasswordService";
import { password_regex } from "../../Utils/Constants/constants";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import { notification } from "antd";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mutaion = useUpdateUserProfile();
  const [api, contextHolder] = notification.useNotification();

  useEffect(()=>{
    if(!sessionStorage.getItem("dbsUserId"))
    {
      navigate(screenNames.SIGN_IN);
    }
  },[])
 

  const changePassword = async (event: React.FormEvent) => {

    event.preventDefault();

    if (pwd === confirmPwd) {
     
        const registerData: PasswordRequest = {
          instituteCode: sessionStorage.getItem("instituteCode") || "",
          transmissionTime: Date.now(),
          dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
          failedLoginNo: 0,
          password: pwd,
        };
        setIsLoading(true);
        const response:any = await mutaion.mutateAsync(registerData);
        if(response.status===200) {
        setIsLoading(false);
        const notificationData: CommonnotificationProps = {
          type: "success",
          msgtitle: "Success",
          msgDesc: "Password updated. Please login to continue",
          api: api,
        };
        openNotificationWithIcon(notificationData);
        setTimeout(()=>{navigate({ pathname: screenNames.SIGN_IN })}, 2000);
      } else {

        setIsLoading(false);
        const notificationData: CommonnotificationProps = {
          type: "error",
          msgtitle: "Error",
          msgDesc: "Password does not updated",
          api: api,
        };
        openNotificationWithIcon(notificationData);
      }
    } else {
      const notificationData: CommonnotificationProps = {
        type: "error",
        msgtitle: "Error",
        msgDesc: "Password and Confirm Password do not match. Please ensure they are the same",
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
      <div className={styles["password-imageContainer"]}>
        <img
          className={styles["change-password-image"]}
          src={ChangePasswordIcon}
          alt="forgotPasswordImage"
        />
      </div>
      <form className={styles["password-form"]} onSubmit={changePassword}>
        <InputField
          image={password}
          placeholder={"Password"}
          type={"password"}
          required={true}
          value={pwd}
          onChange={(e)=>{setPwd(e.target.value)}}
          pattern={password_regex}
        />
        <InputField
          image={repeat}
          placeholder={"Repeat Password"}
          type={"password"}
          required={true}
          value={confirmPwd}
          onChange={(e)=>{setConfirmPwd(e.target.value)}}
          pattern={password_regex}
        />
        <Button text={"Submit"} type={"submit"} disabled={false} />
      </form>
    </div>
    </>
  );
};

// export default ChangePassword;
