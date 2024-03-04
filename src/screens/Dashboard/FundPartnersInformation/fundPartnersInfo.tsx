import React, { useEffect, useState } from "react";
import styles from "./fundPartnersInfo.module.css";
import { FundPartnersInfoCard } from "../../../components/FundPartnersInfoCard/fundPartnersInfoCard";
import axios from "axios";
import { fetchConfigInfo } from "../../../Network/api";

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

    const handleClick = async (id: number) => {
        const fundPartner = data?.find((item) => item.id === id);
        if (fundPartner) {
            try {
                const fileURL = `${fundPartner.documentPath}/${fundPartner.documentName}`;
                window.open(fileURL);
            } catch (error) {
                console.error("Error opening document:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className={styles.container}>
                Fund partner Loan Requirement{" "}
            </div>
            <div className={styles.containerContent}>
                <div className={styles.cardWrapper}>
                    {data?.map((d, i) => (
                        <FundPartnersInfoCard
                            key={i}
                            name={d.fundPartner}
                            linkedInformation={d.creditTypeCode}
                            onclick={() => handleClick(d.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
