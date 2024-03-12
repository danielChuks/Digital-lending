import React, { useEffect, useState } from "react";
import styles from "./fundPartnersInfo.module.css";
import { FundPartnersInfoCard } from "../../../components/FundPartnersInfoCard/fundPartnersInfoCard";
import axios from "axios";
import { fetchConfigInfo } from "../../../Network/api";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface FundPartnerInfo {
    id: number;
    fundPartner: string;
    creditTypeCode: string;
    documentPath: string;
    documentName: string;
}

export const FundPartnersInfo = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<FundPartnerInfo[] | null>();
    const navigate = useNavigate();

    const fetchData = async () => {
        const configData = await fetchConfigInfo();
        if (configData) {
            const url = `${configData.baseUrl}app/dbs/customerapplication/findFundPartnerReq`;
            setLoading(true);
            try {
                const res = await axios.get(url);
                if (!res.data.fundPartnerResponseData) {
                    return res.data.error;
                }
                setData(res.data.fundPartnerResponseData);
                setLoading(false);
            } catch (error) {
                return {
                    error,
                };
            }
        }
    };

    const handleClick = async (documentName: string) => {
        try {
            const configData = await fetchConfigInfo();
            if (configData) {
                const url = `${configData.baseUrl}app/dbs/document/viewDocument/${documentName}`;
                const response = await axios.get(url, {
                    responseType: "blob",
                });
                console.log(response);
                const file = new Blob([response.data], {
                    type: "application/pdf",
                });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const route = () => {
        navigate("/dashboard/createCreditApplication");
    };
    return (
        <div>
            <div className={styles.container}>
                <div className={styles["header"]}>
                    Fund partner Loan Requirement
                </div>
                <div className={styles["proceedBtn"]}>
                    <div onClick={route}>
                        Proceed to apply <FaArrowRight />
                    </div>
                </div>
            </div>
            <div className={styles.containerContent}>
                <div className={styles.cardWrapper}>
                    {data?.map((d, i) => (
                        <FundPartnersInfoCard
                            key={i}
                            name={d.fundPartner}
                            linkedInformation={d.documentName}
                            onclick={() => handleClick(d.documentName)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
