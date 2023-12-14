import React, { useEffect, useState } from "react";
import { ConfigProvider, notification, RadioChangeEvent } from "antd";
import { Tabs } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import Loader from "../../../components/Loader/loader";
import styles from "./fundTransfer.module.css";
import { useGetPicklist } from "../../CreateCustomer/createCustomerService";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../../components/Notification/commonnotification";
import { useNavigate } from "react-router-dom";
import NewBeneficiary from "./newBeneficiary";
import ExtBeneficiary from "./extBeneficiary";
import { UserDetailRequest, useValidateOTP, ValidateOTP } from "../../OtpVerification/otp";
import { useAccountList } from "../Account/account";
import TranscationOTP from "./transcationOTP";
import { useFundTransfer } from "./fundTransferServices";
import DialogueBox, { DialogueBoxProps } from "../../../components/Model/model";
import { useCustomerContext } from "../../../context/customerDetailsContext";

const FundTransfer: React.FC = () => {
  const [size, setSize] = useState<SizeType>("large");
  const [isLoading, setIsLoading] = useState(false);
  const picklistMutation = useGetPicklist();
  const [api, contextHolder] = notification.useNotification();
  const verifyOTPMutation = useValidateOTP();
  const navigate = useNavigate();
  const [transferTypes, setTransferTypes] = useState<any>();
  const accountListMutation = useAccountList();
  const [accountListData, setAccountListData] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any>();
  const [extBeneficiaries, setExtBeneficiaries] = useState<any>();
  const [open, setOpen] = useState(false);
  const [otp, setOTP] = useState(["", "", "", ""]);
  const [activeKey, setActiveKey] = useState(1);
  const [newBeneficiaryData,setNewBeneficiaryData]=useState<any>();
  const [extBeneficiaryData,setExtBeneficiaryData]=useState<any>();
  const fundTransfer = useFundTransfer();
  const [modelOpen, setModelOpen] = useState(false);
  const [modelData, setModelData] = useState<DialogueBoxProps>({
    title: "",
    content: "",
    okText: "",
    cancelText: "",
    onOk: "",
    onCancel: true,
  });
  const { CustomerData, setCustomerData } = useCustomerContext();

  const fetchExtBeneficiaries = async () => {
    const payload = {
      instituteCode: "DBS01",
      transmissionTime: Date.now(),
      category: "FETCH_CUSTOMER_BENEFICIARY",
      subCategory: sessionStorage.getItem("custId"),
    };
    const data: any = await picklistMutation.mutateAsync(payload);
    if (data.status === 200) {
      if (data.data.pickListMap.FETCH_CUSTOMER_BENEFICIARY) {
        let temp: { value: any; label: any }[] = [];
        data.data.pickListMap.FETCH_CUSTOMER_BENEFICIARY?.map(
          (data: { listKey: any; listDesc: any }) => {
            temp.push({
              value: data.listKey,
              label: data.listDesc,
            });
          }
        );
        setExtBeneficiaries(temp);
      }
    } 
    else if (data.errorCode === "CI_JWT_001" || data.errorCode === "CI_JWT_002") {
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
  };

  const validateOTP = async () => {

    const request: ValidateOTP = {
      instituteCode: sessionStorage.getItem("instituteCode") || "",
      transmissionTime: Date.now(),
      dbsUserId: sessionStorage.getItem("dbsUserId") || "",
      securityCd: otp.join("").toString(),
    };
    setIsLoading(true);
   const response:any = await verifyOTPMutation.mutateAsync(request);
   
   if(response.status===200)
   {
    setIsLoading(false);
    handleFundTransfer();
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
    setOTP(["", "", "", ""]);
  }
};

const receiveDataFromExtBeneficiary = (data:any) => {
  setExtBeneficiaryData(data);
};


const receiveDataFromNewBeneficiary = (data:any) => {
  setNewBeneficiaryData(data);
};


const handleFundTransfer = async () => {
    let payload;
    if(activeKey===1){
      payload=extBeneficiaryData;
    }
    if(activeKey===2){
      payload=newBeneficiaryData;
    }
    setIsLoading(true);
    const data: any = await fundTransfer.mutateAsync(payload);
    if (data.status === 200) {
      setOpen(false);
      setIsLoading(false);
      if (data.data?.txnReference) {
        const notificationData: CommonnotificationProps = {
          type: "success",
          msgtitle: "Fund Transferred successfully",
          msgDesc:
            "The Transcation Reference Number is " + data.data?.txnReference,
          api: api,
        };
        openNotificationWithIcon(notificationData);
      }
    } 
    else if (data.errorCode === "CI_JWT_001" || data.errorCode === "CI_JWT_002") {
      setIsLoading(false);
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
      setOpen(false);
      setIsLoading(false);
      const notificationData: CommonnotificationProps = {
        type: "error",
        msgtitle: "",
        msgDesc: data.errorMessage,
        api: api,
      };
      openNotificationWithIcon(notificationData);
    }
};
  const tabsData = [
    {
      label: "Existing Beneficiary",
      component: (
        <ExtBeneficiary
          transferTypes={transferTypes}
          accountListData={accountListData}
          currencies={currencies}
          extBeneficiaries={extBeneficiaries}
          open={open}
          setOpen={setOpen}
          sendDataToParent={receiveDataFromExtBeneficiary}
          setOTP={setOTP}
        />
      ),
    },
    {
      label: "New Beneficiary",
      component: (
        <NewBeneficiary
          transferTypes={transferTypes}
          accountListData={accountListData}
          currencies={currencies}
          fetchExtBeneficiaries={fetchExtBeneficiaries}
          open={open}
          setOpen={setOpen}
          sendDataToParent={receiveDataFromNewBeneficiary}
          setOTP={setOTP}
        />
      ),
    },
  ];

  const FETCH_TRANSFER_TYPE = [
    {
      value: "NIPPALMS",
      label: "Other Banks",
    },
    {
      value: "PROVIDUS",
      label: "Providus Bank",
    },
    {
      value: "PALMS",
      label: "PALMS Digital",
    },
    {
      value: "OWN",
      label: "Own Account",
    },
  ];

  useEffect(() => {
    if(sessionStorage.getItem("customerDraftFlag")==="true"){
      setCustomerData((prev) => ({
        ...prev,
        customerDraftFlag: true,
      }));
    }
    fetPicklistData();
    getAccountListData();
    fetchCurrencies();
    fetchExtBeneficiaries();
  }, []);

  const fetPicklistData = () => {
    setTransferTypes(FETCH_TRANSFER_TYPE);
  };

  const getAccountListData = async () => {
    setIsLoading(true);
    const requestdata: UserDetailRequest = {
      instituteCode: sessionStorage.getItem("instituteCode") || "{}",
      transmissionTime: Date.now(),
      dbsUserId: sessionStorage.getItem("dbsUserId") || "{}",
    };
    const data: any = await accountListMutation.mutateAsync(requestdata);
    if (data.status === 200) {
      setIsLoading(false);

      if (data.data?.dpAcctDetails) {
        let temp: { value: any; label: any }[] = [];
        data.data?.dpAcctDetails?.map(
          (data: { acctNo: any; acctName: any }) => {
            temp.push({
              value: data.acctNo,
              label: data.acctName,
            });
          }
        );
        setAccountListData(temp);
      }
    } 
    else if (data.errorCode === "CI_JWT_001" || data.errorCode === "CI_JWT_002") {
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
      // const data: CommonnotificationProps = {
      //   type: "error",
      //   msgtitle: error.response.data[0].code,
      //   msgDesc: error.response.data[0].message,
      //   api: api,
      // };
      // openNotificationWithIcon(data);
    }
  };

  const fetchCurrencies = async () => {
    const payload = {
      instituteCode: "DBS01",
      transmissionTime: Date.now(),
      category: "FETCH_CURRENCIES",
    };
    const data: any = await picklistMutation.mutateAsync(payload);
    if (data.status === 200) {
      if (data.data.pickListMap.FETCH_CURRENCIES) {
        let temp: { value: any; label: any }[] = [];
        data.data.pickListMap.FETCH_CURRENCIES?.map(
          (data: { listKey: any; listDesc: any }) => {
            temp.push({
              value: data.listKey,
              label: data.listDesc,
            });
          }
        );
        setCurrencies(temp);
      }
    } 
    else if (data.errorCode === "CI_JWT_001" || data.errorCode === "CI_JWT_002") {
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
  };

  // const fetPicklistData = async () => {
  //   const payload = {
  //     instituteCode: "DBS01",
  //     transmissionTime: Date.now(),
  //     category: "FETCH_TRANSFER_TYPE",
  //   };
  //   const data: any = await picklistMutation.mutateAsync(payload);
  //   if (data.status === 200) {
  //     if (data.data.pickListMap.FETCH_TRANSFER_TYPE) {
  //       let temp: { value: any; label: any }[] = [];
  //       data.data.pickListMap.FETCH_TRANSFER_TYPE?.map(
  //         (data: { listKey: any; listDesc: any }) => {
  //           temp.push({
  //             value: data.listKey,
  //             label: data.listDesc,
  //           });
  //         }
  //       );
  //       setTransferTypes(temp);
  //     }
  //   } else if (data.errorCode === "CI_JWT_001" || data.errorCode === "CI_JWT_002") {
  //     const notificationData: CommonnotificationProps = {
  //       type: "info",
  //       msgtitle: "Notification",
  //       msgDesc: "Your session is over, Please login again",
  //       api: api,
  //     };
  //     openNotificationWithIcon(notificationData);
  //     setTimeout(() => {
  //       navigate({ pathname: "/login" });
  //     }, 3000);
  //   }
  // };
 

  const handleTabChange = (key:any) => {
    setActiveKey(key);
  };


  return (
    <div className={"main-container"}>
      <DialogueBox
          open={modelOpen}
          DialogueBoxProps={modelData}
          setOpen={setModelOpen}
        />
      {contextHolder}
      <Loader loading={isLoading} />
      <div className={"main-heading"}>Fund Transfer</div>
      <div className={styles["main-action-container"]}>
        {open ? (
          <TranscationOTP
            open={open}
            setOpen={setOpen}
            setOTP={setOTP}
            otp={otp}
            validateOTP={validateOTP}
          />
        ) : (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#3AC793",
              },
            }}
          >
            <Tabs
              onChange={handleTabChange}
              defaultActiveKey="1"
              size={size}
              items={tabsData.map((data, i) => {
                const id = String(i + 1);
                return {
                  label: data.label,
                  key: id,
                  children: data.component,
                };
              })}
            />
          </ConfigProvider>
        )}
      </div>
    </div>
  );
};

export default FundTransfer;
