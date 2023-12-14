import React, { useEffect } from "react";
import styles from "./dashboard.module.css";
import AccountIcon from "../../assets/icons/dashboard/account.png";
import CashTransferIcon from "../../assets/icons/dashboard/cash_transfer.png";
import ApplyLoanIcon from "../../assets/icons/dashboard/loan.png";
import DraftIcon from "../../assets/icons/dashboard/draft.png";
import MessageIcon from "../../assets/icons/dashboard/message.png";
import TrackIcon from "../../assets/icons/dashboard/track.png";
import { useNavigate } from "react-router-dom";
import { useCustomerContext } from "../../context/customerDetailsContext";
import { useCreditApplicationDataContext } from "../../context/creditApplDetailsContext";
import openNotificationWithIcon, { CommonnotificationProps } from "../../components/Notification/commonnotification";
import { notification } from "antd";


const Dashboard = () => {
  const navigate = useNavigate();
  const { CustomerData, setCustomerData } = useCustomerContext();
  const { creditApplDataFields_context, setCreditApplDataFields_context } = useCreditApplicationDataContext();
  const [api,contextHolder] = notification.useNotification();

  useEffect(() => {
    setCustomerData((prev) => ({
      ...prev,
      addDocumentFlag: false,
    }));

    if (sessionStorage.getItem("customerDraftFlag")==="true") {
      setCustomerData((prev) => ({
        ...prev,
        customerDraftFlag: true,
      }));
    }

    setCustomerData((prev) => ({
      ...prev,
      customerDraftReadOnlyFlag: false,
    }));
    sessionStorage.setItem("customerDraftReadOnlyFlag", "false");

    setCreditApplDataFields_context({
      basicInfo: {},
      documentInfodata: [],
      collateralinfoData: [],
      loading:false
    });
    sessionStorage.removeItem('dbsCustApplId');
    setCreditApplDataFields_context((prev) => ({
      ...prev,
      addDocumentFlag: false,
    }));

  }, [])

  const actionIconsList = [
    {
      id: 1,
      name: "Account",
      icon: AccountIcon,
      path: "/dashboard/account",
    },
    {
      id: 2,
      name: "Apply",
      icon: ApplyLoanIcon,
      path: "/dashboard/createCreditApplication",
    },
    {
      id: 3,
      name: "Draft",
      icon: DraftIcon,
      path: "/dashboard/draftList",
    },
    {
      id: 4,
      name: "Transfer",
      icon: CashTransferIcon,
      path: "/dashboard/fundTransfer",
    },
    {
      id: 5,
      name: "Track",
      icon: TrackIcon,
      path: "/dashboard/track",
    },
    {
      id: 6,
      name: "Message",
      icon: MessageIcon,
      path: "/dashboard/message",
    },
  ];

  const handleNavigator=(data:any)=>{

    if(data ==="/dashboard/createCreditApplication" || data ==="/dashboard/message" || data ==="/dashboard/fundTransfer"){
      if(sessionStorage.getItem("custNo")==="null")
      {
        const notificationData: CommonnotificationProps = {
          type: "info",
          msgtitle: "Notification",
          msgDesc: "There is no active customer to perform this action",
          api: api,
        };
        openNotificationWithIcon(notificationData);

      }
      else {
        navigate(data);
      }
    }
    else {
      navigate(data);
    }
  }



  return (
    <>
    {contextHolder}
    <div className="main-container">
      <div className={styles["dashboard-heading"]}>Dashboard</div>
      <section className={styles["dashboard-content"]}>
        <div className={styles["action-icons-container"]}>
          {actionIconsList.map(({ id, name, icon, path }) => (
            <div
              key={id}
              className={styles["action-box"]}
              onClick={() => handleNavigator(path)}
            >
              <div className={styles["icon-container"]}>
                <img className={styles["action-icon"]} src={icon} alt="" />
              </div>
              <div className={styles["action-name"]}>{name}</div>
            </div>
          ))}
        </div>
        <div className={styles["right-carousel-container"]}>
          <iframe
            src={"http://129.151.174.6:9070/rubikonciappreact/app/dbs/userservice/getBankOffers"}
            frameBorder="0"
          ></iframe>
        </div>
      </section>
    </div>
    </>
  );
};

export default Dashboard;
