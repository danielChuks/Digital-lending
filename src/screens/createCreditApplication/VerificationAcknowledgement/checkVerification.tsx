import { useEffect, useState } from "react";
import styles from "./checksVerification.module.css";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { notification } from "antd";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { fetchConfigInfo } from "../../../Network/api";
import Loader from "../../../components/Loader/loader";
import { verificationAtom } from "../../../state";
import { VerificationStatusProps } from "../../../interfaces";

export const CheckVerification = () => {
    const setVerificationStatus: SetterOrUpdater<VerificationStatusProps> =
        useSetRecoilState(verificationAtom);
    const [loading, setLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const [api] = notification.useNotification();
    const [dataIdentification, setDataIdentification] =
        useState<CustomerInfo | null>();

    const fetchData = async () => {
        setLoading(true);
        try {
            const configData = await fetchConfigInfo();
            const url = `${configData.baseUrl}app/dbs/customerapplication/findCustomerIdDetails`;
            const payload = {
                dbsUserId: sessionStorage.getItem("dbsUserId"),
                channelCode: "DBS",
                channelId: "144",
                instituteCode: "DBS01",
                transmissionTime: 1707808990284,
            };
            const response = await axios.post(url, payload);
            if (response.status === 200) {
                setDataIdentification(response.data);
                setVerificationStatus((prevStatus) => ({
                    ...prevStatus,
                    ninVerified: response.data.ninVerifyFg === "Y",
                    bvnVerified: response.data.bvnVerifyFg === "Y",
                }));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            return { error: error };
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProceed = async () => {
        try {
            setLoading(true);
            const configData = await fetchConfigInfo();
            const consentUrl = `${configData.baseUrl}/app/dbs/creditapplication/validateChecksForCreditAppl?consent=${consent}`;
            const response = await axios.post(consentUrl, dataIdentification);
            if (response.data.error) {
                toast.error("failed to validate at this time");
            } else {
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleConsent = () => {
        setConsent(true);
        toast.error("failed to validate at this time");
    };

    if (loading || !dataIdentification) {
        return <Loader loading={loading} />;
    }

    const amlVerificationStatus =
        dataIdentification.amlVerifyFg === null
            ? "Not verified"
            : dataIdentification.amlVerifyFg === "N"
            ? "Failed"
            : "Verified";

    const bvnVerificationStatus =
        dataIdentification.bvnVerifyFg === null
            ? "Not verified"
            : dataIdentification.bvnVerifyFg === "N"
            ? "Failed"
            : "Verified";

    const ninVerificationStatus =
        dataIdentification.ninVerifyFg === null
            ? "Not verified"
            : dataIdentification.ninVerifyFg === "N"
            ? "Failed"
            : "Verified";

    const cacVerificationStatus =
        dataIdentification.cacVerifyFg === null
            ? "Not verified"
            : dataIdentification.cacVerifyFg === "N"
            ? "Failed"
            : "Verified";
    return (
        <>
            <div className={styles["container"]}>
                <div className={styles["header"]}>
                    Identity Verification checks
                </div>
                <div className={styles["subtitle"]}>
                    We are about to conduct Identity Verification for the
                    following issues:
                </div>

                <div className={styles["table-contanier"]}>
                    <div className={styles["table-header"]}>
                        <div>Identification Types</div>
                        <div className={styles["iDcontent"]}>
                            National Identity No (NIN)
                        </div>
                        <div className={styles["iDcontent"]}>
                            Bank Verification No (BVN)
                        </div>
                        <div className={styles["iDcontent"]}>
                            Anti Money Laundering(AML)
                        </div>
                        {dataIdentification.customerCategory === "COR" && (
                            <div className={styles["iDcontent"]}>
                                {dataIdentification?.customerIdentification.some(
                                    (item) => item.identityTypeCd === "IT108"
                                )
                                    ? "Corporate Affairs Commission"
                                    : "Business Name"}
                            </div>
                        )}
                    </div>
                    <div className={styles["table-header"]}>
                        <div>ID Number</div>
                        <div className={styles["iDcontent"]}>
                            {
                                dataIdentification?.customerIdentification.find(
                                    (item) => item.identityTypeCd === "IT106"
                                )?.identityNumber
                            }
                        </div>
                        <div className={styles["iDcontent"]}>
                            {
                                dataIdentification?.customerIdentification.find(
                                    (item) => item.identityTypeCd === "BVN"
                                )?.identityNumber
                            }
                        </div>
                        <div className={styles["iDcontent"]}>
                            {dataIdentification.mobile}
                        </div>

                        {dataIdentification.customerCategory === "COR" && (
                            <div className={styles["iDcontent"]}>
                                {
                                    dataIdentification?.customerIdentification.find(
                                        (item) =>
                                            item.identityTypeCd === "IT108"
                                    )?.identityNumber
                                }
                            </div>
                        )}
                    </div>
                    <div className={styles["table-header"]}>
                        <div>Outcome</div>
                        <div className={styles["iDcontent"]}>
                            {ninVerificationStatus}
                        </div>
                        <div className={styles["iDcontent"]}>
                            {bvnVerificationStatus}
                        </div>
                        <div className={styles["iDcontent"]}>
                            {amlVerificationStatus}
                        </div>
                        {dataIdentification.customerCategory === "COR" && (
                            <div className={styles["iDcontent"]}>
                                {cacVerificationStatus}
                            </div>
                        )}
                    </div>
                </div>

                {dataIdentification.bvnVerifyFg !== "Y" &&
                    dataIdentification.ninVerifyFg !== "Y" && (
                        <div className={styles["checkbox"]}>
                            <div className={styles["verification"]}>
                                <div>
                                    <input
                                        type='checkbox'
                                        onClick={handleConsent}
                                    />
                                </div>
                                I consent to external Verification of my
                                identity with the identification provides as
                                listed above
                            </div>

                            <div
                                className={styles["proceed"]}
                                onClick={handleProceed}
                            >
                                Verify <FaArrowRight />
                            </div>
                        </div>
                    )}
            </div>
        </>
    );
};

interface CustomerInfo {
    amlExpiryDate: string | null;
    amlId: string | null;
    amlVerifyFg: string | null;
    bvnExpiryDate: string | null;
    bvnId: string | null;
    bvnVerifyFg: string | null;
    cacExpiryDate: string | null;
    cacId: string | null;
    cacVerifyFg: string | null;
    customerCategory: string;
    customerIdentification: {
        identityTypeCd: string;
        identityNumber: string;
    }[];
    dateOfBirth: string;
    dbsUserId: number;
    email: string;
    errorMsg: string | null;
    firstName: string;
    lastName: string;
    middleName: string;
    mobile: string;
    ninExpiryDate: string | null;
    ninId: string | null;
    ninVerifyFg: string | null;
    objectId: string | null;
    referenceNo: string | null;
}
