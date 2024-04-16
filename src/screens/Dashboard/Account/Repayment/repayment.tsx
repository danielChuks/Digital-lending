import React, { useEffect, useState } from "react";
import { RepaymentScheduleRequest, useRepaymentSchedule } from "../account";
import { useLocation, useNavigate } from "react-router-dom";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../../components/Notification/commonnotification";
import { notification } from "antd";
import { ColumnsType } from "antd/es/table";
import CustomTable from "../../../../components/Table/Table";
import styles from "./repayment.module.css";
import Button from "../../../../components/Button/Button";
import Loader from "../../../../components/Loader/loader";

interface DataType {
    installmentNo: any;
    dueDate: string;
    event: string;
    principalAmt: number;
    interestAmt: number;
    fees: number;
    lateFees: number;
    totalAmt: number;
    servicedAmt: number;
    servicedDate: string | null;
    daysLate: number;
    outstandingAmt: number;
}

export const Repayment = () => {
    const navigate = useNavigate();
    const repaymentScheduleMutationFunction = useRepaymentSchedule();
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [repaymentScheduleStatement, setrepaymentScheduleStatement] =
        useState<DataType[]>([]);

    const {
        state: { selectedAccount },
    } = useLocation();

    const fetchData = async () => {
        setIsLoading(true);
        const request: RepaymentScheduleRequest = {
            instituteCode: sessionStorage.getItem("instituteCode") || "{}",
            channelCode: "DBS",
            channelId: "144",
            transmissionTime: Date.now(),
            acctNo: selectedAccount[0].acctNo,
        };

        const data: any = await repaymentScheduleMutationFunction.mutateAsync(
            request
        );
        if (data.status) {
            setrepaymentScheduleStatement(data?.data.repaymentScheduleData);
            setIsLoading(false);
        } else if (
            data.errorCode === "CI_JWT_001" ||
            data.errorCode === "CI_JWT_002"
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
        }
    };
    const columns: ColumnsType<DataType> = [
        {
            title: "No",
            dataIndex: "installmentNo",
            key: "installmentNo",
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
        },
        {
            title: "Event",
            dataIndex: "event",
            key: "event",
        },
        {
            title: "Principal Amount",
            dataIndex: "principalAmt",
            key: "principalAmt",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Interest Amount",
            dataIndex: "interestAmt",
            key: "interestAmt",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Fees",
            dataIndex: "fees",
            key: "fees",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Late Fees",
            dataIndex: "lateFees",
            key: "lateFees",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmt",
            key: "totalAmt",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Serviced Amount",
            dataIndex: "servicedAmt",
            key: "servicedAmt",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Serviced Date",
            dataIndex: "servicedDate",
            key: "servicedDate",
        },
        {
            title: "Outstanding Amount",
            dataIndex: "outstandingAmt",
            key: "outstandingAmt",
            render: (value: number) => formatNumber(value),
        },
        {
            title: "Days Late",
            dataIndex: "daysLate",
            key: "daysLate",
        },
    ];

    const formatNumber = (value: number) => {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {contextHolder}
            <section className={styles["account-repayment-content"]}>
                <Loader loading={isLoading} />
                <div className={styles["repayment-table-container"]}>
                    <CustomTable
                        columns={columns}
                        data={repaymentScheduleStatement}
                        tableTitle={"Schedule"}
                    />
                </div>
                <div className={styles["repayment-mobile-container"]}>
                    <div className={styles["repayment-mobile-header"]}>
                        Transactions
                    </div>
                    <div className={styles["repayment-box-container"]}>
                        {repaymentScheduleStatement?.map(
                            ({
                                installmentNo,
                                dueDate,
                                event,
                                principalAmt,
                                interestAmt,
                                fees,
                                lateFees,
                                totalAmt,
                                servicedAmt,
                                servicedDate,
                                outstandingAmt,
                                daysLate,
                            }) => (
                                <div className={styles["repayment-box"]}>
                                    <p>{installmentNo}</p>
                                    <p>{dueDate}</p>
                                    <p>{event}</p>
                                    <p className={styles["amount-right"]}>
                                        {principalAmt}
                                    </p>
                                    <p className={styles["amount-right"]}>
                                        {interestAmt}
                                    </p>
                                    <p className={styles["amount-right"]}>
                                        {fees}
                                    </p>
                                    <p className={styles["amount-right"]}>
                                        {lateFees}
                                    </p>
                                    <p className={styles["amount-right"]}>
                                        {totalAmt}
                                    </p>
                                    <p className={styles["amount-right"]}>
                                        {servicedAmt}
                                    </p>
                                    <p>{servicedDate}</p>
                                    <p className={styles["amount-right"]}>
                                        {outstandingAmt}
                                    </p>
                                    <p>{daysLate}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className={styles["buton-container"]}>
                    <Button
                        text={"Back"}
                        type={"button"}
                        disabled={false}
                        buttonType={"back"}
                        icon={true}
                        onClick={() => navigate("/dashboard/account")}
                    />
                </div>
            </section>
        </>
    );
};
