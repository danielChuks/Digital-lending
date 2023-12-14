import { useNavigate } from "react-router-dom";
import styles from "./forgotPassword.module.css";
import mobile from "../../assets/icons/mobile.png";
import forgotpassword from "../../assets/images/forgotpassword.png";
import InputField from "../../components/InputFiled/InputField";
import Button from "../../components/Button/Button";
import * as screenNames from "../../Utils/Constants/screennames";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/loader";
import { ValidateUserRequest, useValidateUser } from "./forgotpasswordService";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import { notification } from "antd";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const useValidateUserMutation = useValidateUser();
  const [mobileNumber, setMobileNumber] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    sessionStorage.removeItem("dbsUserId");
  }, []);

  const validateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const request: ValidateUserRequest = {
      instituteCode: sessionStorage.getItem("instituteCode") || "{}",
      transmissionTime: Date.now(),
      mobile: mobileNumber,
    };
    setIsLoading(true);
    const response: any = await useValidateUserMutation.mutateAsync(request);
    if (response.status === 200) {
      setIsLoading(false);
      const params = {
        isFromForgotUser: true,
      };
      sessionStorage.setItem("dbsUserId", response.data.dbsUserId.toString());
      navigate(screenNames.VERIFY_OTP, { state: { params: params } });
    } 
    
    else {
      setMobileNumber("");
      setIsLoading(false);
      const notificationData: CommonnotificationProps = {
        type: "error",
        msgtitle: "error",
        msgDesc: "There is no user linked with this mobile number",
        api: api,
      };
      openNotificationWithIcon(notificationData);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles["main"]}>
        <Loader loading={isLoading} />
        <div className={styles["password-header"]}>Forgot Password</div>
        <div className={styles["password-imageContainer"]}>
          <img src={forgotpassword} alt="forgotPasswordImage" />
        </div>
        <div className={styles["password-textContainer"]}>
          <p>Enter the Registered Mobile Number Associated with your Account</p>
        </div>
        <form className={styles["password-form"]} onSubmit={validateUser}>
          <InputField
            image={mobile}
            placeholder={"mobile"}
            type={"text"}
            required={true}
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value);
            }}
            pattern={"^[0-9]+$"}
            maxLength={11}
          />
          <div className={styles["submitBtn"]}>
            <Button text={"Get OTP"} type={"submit"} disabled={false} />
          </div>
          <div className={styles["backtoLogin-portion"]}>
            <p
              onClick={() => {
                navigate({ pathname: screenNames.SIGN_IN });
              }}
            >
              Back to Sign In
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
