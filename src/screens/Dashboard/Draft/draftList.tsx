import React, { useState, useEffect } from "react";
import styles from "./draftList.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Loader from "../../../components/Loader/loader";
import { useFindAppDraft, useRemoveAppDraft } from "./draft";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteOutlined";
import ArrowRightOutlined from "@ant-design/icons/lib/icons/ArrowRightOutlined";
import openNotificationWithIcon, { CommonnotificationProps } from "../../../components/Notification/commonnotification";
import { notification } from "antd";
import DialogueBox, { DialogueBoxProps } from "../../../components/Model/model";
import { useCustomerContext } from "../../../context/customerDetailsContext";

export const DraftList = () => {
  const navigate = useNavigate();
  const useFindAppDraftMutation = useFindAppDraft();
  const useRemoveAppDraftMutation = useRemoveAppDraft();
  const [draftListData, setDraftListData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [modelData, setModelData] = useState<DialogueBoxProps>({
    title: "",
    content: "",
    okText: "",
    cancelText: "",
    onOk: "",
    onCancel: true,
  });
  const [modelOpen, setModelOpen] = useState(false);
  const { CustomerData, setCustomerData } = useCustomerContext();


  useEffect(() => {
    if(sessionStorage.getItem("customerDraftFlag")==="true"){
      setCustomerData((prev) => ({
        ...prev,
        customerDraftFlag: true,
      }));
    }
    getDraftListData();
  }, []);

  const getDraftListData = async () => {
    setIsLoading(true);
    const request: any = {
      dbsUserId: sessionStorage.getItem("dbsUserId"),
    };
    const response: any = await useFindAppDraftMutation.mutateAsync(request);
    if (response.status === 200) {
      setIsLoading(false);
      if (response.data?.applData?.length > 0) {
        setDraftListData([]);
        response.data.applData.map((data: any) => {
          if (data.applType === "CUSTOMER") {
            if (!data.custDraftData?.responseMsg) {
              setDraftListData((prev: any) => [...prev, data]);
            }
          }
          if (data.applType === "CREDIT") {
            if (!data.creditAppDraftData?.responseMsg) {
              setDraftListData((prev: any) => [...prev, data]);
            }
          }
        })
      }
      else {
        const notificationData: CommonnotificationProps = {
          type: "info",
          msgtitle: "Notification",
          msgDesc: "Your don't have any draft, Please create it",
          api: api,
        };
        openNotificationWithIcon(notificationData);
        setTimeout(() => { navigate({ pathname: '/login' }) }, 3000);
      }
    }
    else if (response.errorCode === "CI_JWT_001" || response.errorCode === "CI_JWT_002") {
      const notificationData: CommonnotificationProps = {
        type: "info",
        msgtitle: "Notification",
        msgDesc: "Your session is over, Please login again",
        api: api,
      };
      openNotificationWithIcon(notificationData);
      setTimeout(() => { navigate({ pathname: '/login' }) }, 3000);
    }
    else {
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


  const HandleModifyDraft = (id: any, applType: any) => {

    if (applType === "CUSTOMER") {
      sessionStorage.setItem("dbsCustApplId", id);
      navigate("/dashboard/createCustomer");
    }
    if (applType === "CREDIT") {
      sessionStorage.setItem("dbsCustApplId", id);
      navigate("/dashboard/createCreditApplication");
    }
  };



  const HandleDraftDelete = (id: any) => {
    setModelOpen(true);
    setModelData({
      title: "Confirmation",
      content: "Are you sure, you want to delete the draft ?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        setModelOpen(false);
        setIsLoading(true);
        const request: any = {
          dbsCustApplId: id,
          instituteCode: sessionStorage.getItem("instituteCode"),
          transmissionTime: Date.now(),
        };
        const response: any = await useRemoveAppDraftMutation.mutateAsync(request);
        if (response.status === 200) {
          setIsLoading(false);
          getDraftListData();
        }
        else if (response.errorCode === "CI_JWT_001" || response.errorCode === "CI_JWT_002") {
          const notificationData: CommonnotificationProps = {
            type: "info",
            msgtitle: "Notification",
            msgDesc: "Your session is over, Please login again",
            api: api,
          };
          openNotificationWithIcon(notificationData);
          setTimeout(() => { navigate({ pathname: '/login' }) }, 3000);
        }
        else {
          setIsLoading(false);
          const notificationData: CommonnotificationProps = {
            type: "error",
            msgtitle: "",
            msgDesc: response.errorMessage,
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
      <div className={"main-container"}>
        <DialogueBox
          open={modelOpen}
          DialogueBoxProps={modelData}
          setOpen={setModelOpen}
        />
        <Loader loading={isLoading} />
        <div className={"main-heading"}>Drafts</div>
        <section className={styles["draft-content"]}>
          <div className={styles["draft-action-container"]}>
            {draftListData.length > 0 ? draftListData?.map(
              (data,
                index
              ) =>
              (
                <div
                  key={index}
                  className={styles["draft-action-box"]}
                >
                  <div className={styles["account-action-header"]}>
                    {data.applType}
                  </div>
                  <div className={styles["draft-action-section"]}>
                    <div className={styles["draft-text-content"]}>
                      <div className={styles["text-container"]}>
                        <p>Appl Reference</p>
                        <b className={styles["green-text"]}>{data.applRefNo}</b>
                      </div>
                      <div className={styles["text-container"]}>
                        <p>Modified Date</p>
                        <b className={styles["green-text"]}>{data.applType === "CUSTOMER" ? (data.custDraftData.modifieddate?.substring(0, 10)) : (data.creditAppDraftData?.strApplicationDate)}</b>
                      </div>
                    </div>
                    <div className={styles["draft-action-content"]}>
                      <div><DeleteFilled style={{ fontSize: '120%' }} onClick={() => { HandleDraftDelete(data.dbsCustApplId) }} /></div>
                      <div><ArrowRightOutlined style={{ fontSize: '120%' }} onClick={() => { HandleModifyDraft(data.dbsCustApplId, data.applType) }} /></div>
                    </div>
                  </div>
                </div>)
            ) : <><p></p><p className={styles["nodata"]}>No draft to Show</p><p></p></>}
          </div>
          <div className={styles["buton-container"]}>
            <Button
              text={"Back"}
              type={"button"}
              disabled={false}
              buttonType={"back"}
              icon={true}
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </section>
      </div>
    </>
  );
};


