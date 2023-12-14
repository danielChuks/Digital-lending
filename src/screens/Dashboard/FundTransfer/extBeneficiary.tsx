import { notification } from "antd";
import { useEffect, useState } from "react";
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
import { useFundTransfer } from "./fundTransferServices";

const ExtBeneficiary = (props: any) => {
  const [validator] = useState(new SimpleReactValidator());
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [currencyInput, setcurrencyInput] = useState("");
  const [txnData, setTxnData] = useState<any>({
    beneficiaryAccountName: "",
    beneficiaryId: null,
    currencyCode: "",
    fundTransferType: "",
    sourceAccountNo: "",
    transactionAmount: null,
    narration: "",
  });
  const fundTransfer = useFundTransfer();
  const [, forceUpdate] = useState({});
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

  const handleFundTransfer = async () => {
    if (validator.allValid()) {
      const payload: any = {
        beneficiaryAccountNo: txnData.beneficiaryAccountNo,
        currencyCode: txnData.currencyCode,
        fundTransferType: txnData.fundTransferType,
        narration: txnData.narration,
        sourceAccountNo: txnData.sourceAccountNo,
        transactionAmount: Number(txnData.transactionAmount)?.toFixed(2),
        beneficiaryAccountName: txnData.beneficiaryAccountName,
        beneficiaryId: txnData.beneficiaryId,
      };
      props.setOTP(["", "", "", ""]);
      props.sendDataToParent(payload);
      props.setOpen(true);
    } else {
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
            onChange={(e) => handleSelector(e, "", "", "fundTransferType")}
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
        <div className={styles["beneficiaryId"]}>
          <CustomSelector
            label={"Existing Beneficiary"}
            onChange={(e, option) =>
              handleSelector(
                e,
                option,
                "beneficiaryAccountName",
                "beneficiaryId"
              )
            }
            optionsList={props.extBeneficiaries}
            value={txnData.beneficiaryId}
            name={"beneficiaryId"}
          />
          <span className="text-error">
            {validator.message(
              "beneficiaryId",
              txnData.beneficiaryId,
              "required"
            )}
          </span>
        </div>
        <div className={styles["currencyCode"]}>
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

        <div className={styles["transactionAmount"]}>
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
        <div className={styles["narration"]}>
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

export default ExtBeneficiary;
