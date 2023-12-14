import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import styles from "../../OtpVerification/otpVerification.module.css";
import fundStyle from "./fundTransfer.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import {
  UserDetailRequest,
  useRequestOTP,
} from "../../OtpVerification/otp"
import { notification } from "antd";
import Loader from "../../../components/Loader/loader";
import CountdownTimer from "../../../components/CountdownTimer/countDownTimer";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../../components/Notification/commonnotification";

const TranscationOTP = (props:any) => {
  const navigate = useNavigate();
  const otpInputRef = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const resentAttempts = 2;
  const [isTimerVisible, setTimerVisible] = useState(false);
  const [resentOtpCount, setResentOtpCount] = useState(0);
  const requestOTPMutation = useRequestOTP();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisableVerifyBtn, setIsDisableVerifyBtn] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
 

  useEffect(() => {
   
    // disable verify button if otp not entered
    const isOtpEntered = props.otp?.filter((value:any) => value === "");
    if (isOtpEntered?.length == 0) {
      setIsDisableVerifyBtn(false);
    } else {
      setIsDisableVerifyBtn(true);
    }
  }, [props.otp]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedOTP = [...props.otp];
    updatedOTP[index] = e.target.value;
    props.setOTP(updatedOTP);

    // Move to the next input field if there is a value
    if (e.target.value && index < props.otp.length - 1) {
      const nextIndex = index + 1;
      otpInputRef.current[nextIndex]?.focus();
    }
  };

  const handleBackSpace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.keyCode === 8 && index < props.otp.length) {
      if (props.otp[props.otp.length - 1] === "") {
        const prevIndex = index - 1;
        otpInputRef.current[prevIndex]?.focus();
      }
    }
  };

  useEffect(() => {
    requestOTP();
  }, []);

  const requestOTP = async () => {
    setResentOtpCount(resentOtpCount + 1);
    if (resentOtpCount === resentAttempts) {
      setTimerVisible(false);
    }

      const request: UserDetailRequest = {
        instituteCode: sessionStorage.getItem("instituteCode") || "{}",
        transmissionTime: Date.now(),
        dbsUserId: sessionStorage.getItem("dbsUserId") || "",
      };
      setIsLoading(true);
      const response:any = await requestOTPMutation.mutateAsync(request);
      if(response.status===200){
        setIsLoading(false);
      }
      else if (response.errorCode === "CI_JWT_001" || response.errorCode === "CI_JWT_002") {
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
      else {
        setIsLoading(false);
        const notificationData: CommonnotificationProps = {
          type: "error",
          msgtitle:"Error",
          msgDesc: response.errorMessage,
          api: api,
        };
        openNotificationWithIcon(notificationData);
        // commonErrorHanlder(error);
      }
      setTimerVisible(true);
    
  };



  return (
    <>
      {contextHolder}
      <div className={styles["main"]}>
        <Loader loading={isLoading} />
        <div className={styles["otp-header"]}>OTP Verification</div>
        <div className={styles["image_container"]}>
          <p>We've sent the code to your registration email address.</p>
        </div>
        <div className={`${styles.text_container} ${fundStyle.text_container}`}>
          <div  className={fundStyle["otp_container"]}>
          <div >
          {props.otp?.map((value:any, index:any) => (
            <input
              className={fundStyle["otp_Input_field"]}
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInputChange(e, index)}
              ref={(input) => (otpInputRef.current[index] = input)}
              onKeyDown={(e) => handleBackSpace(e, index)}
            />
          ))}
           </div>
           <div className={fundStyle["button_container"]}>
           <Button
          text={"Verify"}
          type={"button"}
          disabled={isDisableVerifyBtn}
          onClick={props.validateOTP}
        />
         <Button
          text={"Close"}
          type={"button"}
          onClick={()=>{props.setOpen(false)}}
        />
        </div>
        </div>
        <p className={styles["resend_otp_previous_text"]}>
          Haven't received the Verification code?
        </p>
        {!isTimerVisible && resentOtpCount < resentAttempts + 1 && (
          <p className={styles["resend_otp_text"]} onClick={requestOTP}>
            Resend OTP
          </p>
        )}
        {isTimerVisible ? (
          <CountdownTimer
            duration={10}
            onTimerEnd={() => {
              setTimerVisible(false);
            }}
          />
        ) : (
          ""
        )}
        </div>
      </div>
    </>
  );
};

export default TranscationOTP;
