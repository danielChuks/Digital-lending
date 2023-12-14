import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import Button from "../../../components/Button/Button";
import CustomSelector from "../../../components/CustomSelector/customSelector";
import InputField from "../../../components/InputFiled/InputField";
import Loader from "../../../components/Loader/loader";
import openNotificationWithIcon, {
  CommonnotificationProps,
} from "../../../components/Notification/commonnotification";
import styles from "./fundTransfer.module.css";
import { useFundTransfer, useGetBankList, useGetBeneficiaryName } from "./fundTransferServices";

const NewBeneficiary = (props: any) => {
  const [validator] = useState(new SimpleReactValidator());
  const [txnData, setTxnData] = useState<any>({
    bankName: "",
    bicCode: "",
    beneficiaryAccountName: "",
    beneficiaryAccountNo: "",
    currencyCode: "",
    fundTransferType: "",
    sourceAccountNo: "",
    transactionAmount: "",
    narration: "",
  });
  const getBankListMutation = useGetBankList();
  const getBeneficiaryNameMutation = useGetBeneficiaryName();
  const fundTransfer = useFundTransfer(); 
  const [bankList, setBankList] = useState<any>();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [bankDisableFlag, setBankDisableFlag] = useState(false);
  const [, forceUpdate] = useState({});
  const [currencyInput, setcurrencyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTxnData((prev: any) => ({
      ...prev,
      transactionAmount: currencyInput.replaceAll(",", ""),
    }));
  }, [currencyInput]);

  const handleSelector = (
    value: React.MouseEvent<Element, MouseEvent>,
    option: any,
    optionName: any,
    name: string
  ) => {
    if (option) {
      setTxnData((prev: any) => ({
        ...prev,
        [optionName]: option.label,
      }));
    }
    setTxnData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (txnData.fundTransferType) {
      if (
        txnData.fundTransferType === "NIPPALMS" ||
        txnData.fundTransferType === "PROVIDUS"
      ) {
        setBankDisableFlag(false);
        fetchBankList();
        setTxnData((prev: any) => ({
          ...prev,
          beneficiaryAccountName: "",
          beneficiaryAccountNo: "",
        }));
      } else {
        setTxnData((prev: any) => ({
          ...prev,
          bankName: "",
          bicCode: "",
          beneficiaryAccountName: "",
          beneficiaryAccountNo: "",
        }));
        setBankDisableFlag(true);
      }
    }
  }, [txnData.fundTransferType]);

  const fetchBankList = async () => {
    const payload = {
      dbsUserId: sessionStorage.getItem("dbsUserId"),
    };
    setIsLoading(true);
    const data: any = await getBankListMutation.mutateAsync(payload);
    if (data.status === 200) {
      setIsLoading(false);
      if (data.data?.bankDetails) {
        let temp: { value: any; label: any }[] = [];
        let defaultBankCode: any;
        let defaultBankName: any;
        data.data?.bankDetails?.map(
          (data: { bankCode: any; bankName: any }) => {
            if (data.bankName === "PROVIDUS BANK") {
              defaultBankName = data.bankName;
              defaultBankCode = data.bankCode;
            }
            temp.push({
              value: data.bankCode,
              label: data.bankName,
            });
          }
        );
        if (txnData.fundTransferType === "PROVIDUS") {
          setTxnData((prev: any) => ({
            ...prev,
            bankName: defaultBankName,
            bicCode: defaultBankCode,
          }));
          setBankDisableFlag(true);
        } else {
          setTxnData((prev: any) => ({
            ...prev,
            bankName: "",
            bicCode: "",
          }));
          setBankList(temp);
          setBankDisableFlag(false);
        }
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
  };

  const getBeneficiaryName = async () => {
    if (
      txnData.fundTransferType === "NIPPALMS" ||
      txnData.fundTransferType === "PROVIDUS"
    ) {
      const payload = {
        url:
          txnData.fundTransferType === "NIPPALMS"
            ? "getNipAccount"
            : txnData.fundTransferType === "PROVIDUS"
            ? "providusAccountEnquiry"
            : "",
        payLoad: {
          accountNumber: txnData.beneficiaryAccountNo,
          beneficiaryBank: txnData.bicCode,
        },
      };
      setIsLoading(true);
      const data: any = await getBeneficiaryNameMutation.mutateAsync(payload);
      if (data.status === 200) {
        setIsLoading(false);
        if (data.data?.accountName) {
          setTxnData((prev: any) => ({
            ...prev,
            beneficiaryAccountName: data.data?.accountName,
          }));
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
        setIsLoading(false);
        const notificationData: CommonnotificationProps = {
          type: "error",
          msgtitle: "",
          msgDesc: data.errorMessage,
          api: api,
        };
        openNotificationWithIcon(notificationData);
      }
    }
  };

  const handleFundTransfer = async () => {
    if (validator.allValid()) {
      const payload:any = {
        "beneficiaryAccountNo":txnData.beneficiaryAccountNo,
        "currencyCode": txnData.currencyCode,
        "fundTransferType":txnData.fundTransferType,
        "narration": txnData.narration,
        "sourceAccountNo": txnData.sourceAccountNo,
        "transactionAmount":Number(txnData.transactionAmount)?.toFixed(2),
        }
        if(!(txnData.fundTransferType === "OWN"))
        {
          payload['beneficiaryAccountName']=txnData.beneficiaryAccountName;
          payload["bankName"]=txnData.bankName;
          payload["bicCode"]=txnData.bicCode;

        }
        props.setOTP(["", "", "", ""]);
        props.sendDataToParent(payload);
        props.setOpen(true);
    }
    else {
      validator.showMessages();
      forceUpdate({});
    }
  };


  return (
    <>
      {contextHolder}
      <Loader loading={isLoading} />
      <div className={styles["input-container"]}>
        <div className={styles["fundTransferType"]}>
          <CustomSelector
            label={"Transfer Type"}
            onChange={(e: any) => handleSelector(e, "", "", "fundTransferType")}
            optionsList={props.transferTypes}
            value={txnData.fundTransferType}
            name={"fundTransferType"}
          />
          <span className="text-error">
            {validator.message(
              "fundTransferType",
              txnData.fundTransferType,
              "required"
            )}
          </span>
        </div>
        <div className={styles["sourceAccountNo"]}>
          <CustomSelector
            label={"Debit Account"}
            onChange={(e) => handleSelector(e, "", "", "sourceAccountNo")}
            optionsList={props.accountListData}
            value={txnData.sourceAccountNo}
            name={"sourceAccountNo"}
          />
          <span className="text-error">
            {validator.message(
              "sourceAccountNo",
              txnData.sourceAccountNo,
              "required"
            )}
          </span>
        </div>
        <div className={styles["bicCode"]}>
          <CustomSelector
            label={"Bank"}
            onChange={(e, option) =>
              handleSelector(e, option, "bankName", "bicCode")
            }
            optionsList={bankList}
            value={txnData.bicCode}
            name={"bicCode"}
            readonly={bankDisableFlag}
          />
          <span className="text-error">
            {validator.message("Bank", txnData.bicCode, "required")}
          </span>
        </div>
        <div className={styles["beneficiaryAccountNo"]}>
          <InputField
            label={"Credit Account"}
            type={"text"}
            required={true}
            value={txnData.beneficiaryAccountNo}
            onChange={(event) =>
              setTxnData((prev: any) => ({
                ...prev,
                beneficiaryAccountNo: event.target.value,
              }))
            }
            onBlur={getBeneficiaryName}
          />
           <span className="text-error">
            {validator.message(
              "beneficiaryAccountNo",
              txnData.beneficiaryAccountNo,
              "required"
            )}
          </span>
        </div>
        <div className={styles["beneficiaryAccountName"]}>
          <InputField
            label={"Beneficiary Name"}
            type={"text"}
            required={true}
            value={txnData.beneficiaryAccountName}
            onChange={(event) =>
              setTxnData((prev: any) => ({
                ...prev,
                beneficiaryAccountName: event.target.value,
              }))
            }
          />
            <span className="text-error">
            {validator.message(
              "beneficiaryAccountName",
              txnData.beneficiaryAccountName,
              "required"
            )}
          </span>
        </div>
        <div className={styles["new_currencyCode"]}>
          <CustomSelector
            label={"Currency"}
            onChange={(e) => handleSelector(e, "", "", "currencyCode")}
            optionsList={props.currencies}
            value={txnData.currencyCode}
            name={"currencyCode"}
          />
          <span className="text-error">
            {validator.message("currency", txnData.currencyCode, "required")}
          </span>
        </div>

        <div className={styles["new_transactionAmount"]}>
          <InputField
            label={"Amount"}
            type={"text"}
            required={true}
            value={currencyInput}
            onChange={(event: any) =>
              setcurrencyInput(
                new Intl.NumberFormat().format(
                  event.target.value.replaceAll(",", "")
                )
              )
            }
          />
          <span className="text-error">
            {validator.message(
              "Transaction Amount",
              txnData.transactionAmount,
              "required"
            )}
          </span>
        </div>
        <div className={styles["new_narration"]}>
          <InputField
            label={"Transfer Narration"}
            type={"text"}
            required={true}
            value={txnData.narration}
            onChange={(event) =>
              setTxnData((prev: any) => ({
                ...prev,
                narration: event.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className={styles["button"]}>
        <Button text={"Submit"} type={"button"} onClick={handleFundTransfer} />
      </div>
    </>
  );
};

export default NewBeneficiary;
