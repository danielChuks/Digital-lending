import React, { useState, useEffect, useCallback } from "react";
import styles from "./message.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/loader";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../../components/Notification/commonnotification";
import { Modal, notification } from "antd";
import { useGetMessages } from "../FundTransfer/fundTransferServices";
import messageIcon from "../../../assets/icons/message.png";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import DialogueBox, { DialogueBoxProps } from "../../../components/Model/model";
export const Message = () => {
  const navigate = useNavigate();
  const getMessages = useGetMessages();
  const [userMessages, setUserMessages] = useState<any[]>([
    {
      subject: "Rubikon",
      message: "welcome to Neptune Software group  Neptune Software group",
    },
    {
      subject: "301 - Loan Disbursement By Cash",
      message:
        "Cash amount of USD3,500.00 deposit to account number :<div><br></div><div><br></div><div>**************4638 : Account balance :</div>",
    },
  ]);
  // const [userMessages, setUserMessages] = useState<any[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelData, setModelData] = useState<any>({
    title:"",
    content:""
  });

  ///// find window resolution ////
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { CustomerData, setCustomerData } = useCustomerContext();
  const [windowSize, setWindowSize] = useState<any>();
  const [mobileView, setMobileView] = useState(true);

  ///// find window resolution ////
  const handleWindowResize = useCallback((event: any) => {
    setMobileView(false);
    if (window.innerWidth < 950) {
      setMobileView(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleWindowResize]);

  useEffect(() => {
    setMobileView(false);
    if (windowSize < 950) {
      setMobileView(true);
    }
  }, [windowSize]);

  useEffect(() => {
    if (sessionStorage.getItem("customerDraftFlag")==="true") {
      setCustomerData((prev) => ({
        ...prev,
        customerDraftFlag: true,
      }));
    }
    getMessagesList();
    setWindowSize(window.innerWidth);
  }, []);

  const getMessagesList = async () => {
    setIsLoading(true);
    const request: any = {
      customerNo: sessionStorage.getItem("custNo"),
    };
    const response: any = await getMessages.mutateAsync(request);
    if (response.status === 200) {
      setIsLoading(false);

      if (response.data?.customerAlertOutputCIData?.length > 0) {
        setUserMessages([]);
        response.data?.customerAlertOutputCIData.map((data: any) => {
          setUserMessages((prev: any) => [...prev, data]);
        });
      }
    } else if (
      response.errorCode === "CI_JWT_001" ||
      response.errorCode === "CI_JWT_002"
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
    } else {
      setIsLoading(false);
      const notificationData: CommonnotificationProps = {
        type: "error",
        msgtitle: "",
        msgDesc: response.errorMessage,
        api: api,
      };
      openNotificationWithIcon(notificationData);
    }
  };

  const handleMessage = (subject: any, message: any) => {
    if (mobileView) {
      setModelOpen(true);
      setModelData({
       title:subject,
       content: message
      });
    }
  };
  return (
    <>
      {contextHolder}
      <div className={"main-container"}>
      <Modal
          title={modelData.title}
        open={modelOpen}
        footer={null}
        onCancel={() => {
          setModelOpen(false);
        }}
        style={{left:0}}
      >
        <p>{modelData.content}</p>
      </Modal>
        <Loader loading={isLoading} />

        <div className={"main-heading"}>Messages</div>
        <div className={styles["message-container"]}>
          <div className={styles["message-action-container"]}>
            {userMessages?.map(({ subject, message }, index) => (
              <div
                key={index}
                className={styles["message-action-box"]}
                onClick={() => handleMessage(subject, message)}
              >
                <div className={styles["message-action-icon-container"]}>
                  <img src={messageIcon} />
                </div>
                <div className={styles["message-action-text-container"]}>
                  <div className={styles["message-action-header"]}>
                    {subject}
                  </div>
                  {!mobileView && (
                    <div className={styles["message-action-content"]}>
                      {message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
