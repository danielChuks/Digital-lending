import { useState } from "react";
import styles from "../../createCreditApplication.module.css";
import DocumentInfo from "./documentInfo";
import { useCreditApplicationDataContext } from "../../../../context/creditApplDetailsContext";
import no_identity from "../../../../../src/assets/images/no_identity.png";
import Button from "../../../../components/Button/Button";
import { PlusOutlined } from "@ant-design/icons";
import { useCustomerContext } from "../../../../context/customerDetailsContext";
const DocumentList = () => {
  const { creditApplDataFields_context, setCreditApplDataFields_context } =
    useCreditApplicationDataContext();
  const [open, setOpen] = useState(false);
  const [docData, setDocData] = useState<any>();
  const { CustomerData, setCustomerData } = useCustomerContext();

  return (
    <div>
      {open ? (
        <DocumentInfo
          setOpen={setOpen}
          docData={docData}
          setDocData={setDocData}
        />
      ) : creditApplDataFields_context.documentInfodata == null ||
        creditApplDataFields_context.documentInfodata.length <= 0 ? (
        <div className={styles["nodata-Container"]}>
          <img
            src={no_identity}
            alt="No Date Found"
            className={styles["imgData"]}
          />
          <div className={styles["text-Container"]}>
            <p>Can't find any Documents</p>
            {CustomerData.customerDraftReadOnlyFlag ? (
              ""
            ) : (
              <p>Please add one</p>
            )}
          </div>
          {CustomerData.customerDraftReadOnlyFlag ? (
            ""
          ) : (
            <div className={styles["button-Container"]}>
              <Button
                text={"Add Document"}
                type={"button"}
                onClick={() => {
                  setOpen(true);
                  setCreditApplDataFields_context((prev) => ({
                    ...prev,
                    addDocumentFlag: true,
                  }));
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles["card-main-container"]}>
          {creditApplDataFields_context.documentInfodata.map((data, index) => {
            return (
              <div
                className={`${styles.card_container}`}
                onClick={(e) => {
                  {
                    CustomerData.customerDraftReadOnlyFlag
                      ? e.preventDefault()
                      : setOpen(true);
                    setDocData(data);
                  }
                }}
              >
                <div
                  className={`${styles.card}`}
                  style={{
                    cursor: `${
                      CustomerData.customerDraftReadOnlyFlag
                        ? "not-allowed"
                        : "pointer"
                    }`,
                  }}
                >
                  <div className={styles["card-header"]}>
                    Document - {index + 1}
                  </div>
                  <div className={styles["card-content"]}>
                    <div className={styles["card-content-section"]}>
                      <p>Document Type</p>
                      <p>{data.documentTypeDescription}</p>
                    </div>
                    <div className={styles["card-content-section"]}>
                      <p>Document Reference</p>
                      <p>{data.documentRefernce}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {CustomerData.customerDraftReadOnlyFlag ? (
            ""
          ) : (
            <div className={styles["card-container"]}>
              <div
                className={styles["addnew-card"]}
                onClick={() => {
                  setOpen(true);
                  setCreditApplDataFields_context((prev) => ({
                    ...prev,
                    addDocumentFlag: true,
                  }));
                }}
              >
                <div className={styles["addnew-card-content"]}>
                  <div>
                    <PlusOutlined style={{ fontSize: "30px" }} />
                  </div>
                  <div>Add New</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
