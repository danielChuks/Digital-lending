import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { useCustomerContext } from "../../context/customerDetailsContext";
import { useCreditApplicationDataContext } from "../../context/creditApplDetailsContext";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import { notification } from "antd";
import { GiFamilyHouse } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { RiDraftFill } from "react-icons/ri";
import { HiDocumentSearch } from "react-icons/hi";
import { MdDrafts } from "react-icons/md";
import croller from "../../assets/images/croller.png";
import { FaFileUpload } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate();
    const { setCustomerData } = useCustomerContext();
    const { setCreditApplDataFields_context } =
        useCreditApplicationDataContext();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        setCustomerData((prev) => ({
            ...prev,
            addDocumentFlag: false,
        }));

        if (sessionStorage.getItem("customerDraftFlag") === "true") {
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
            loading: false,
        });
        sessionStorage.removeItem("dbsCustApplId");
        setCreditApplDataFields_context((prev) => ({
            ...prev,
            addDocumentFlag: false,
        }));
    }, []);

    const actionIconsList = [
        {
            id: 1,
            name: "Account",
            icon: <GiFamilyHouse size={80} color='#fff' />,
            path: "/dashboard/account",
        },
        {
            id: 2,
            name: "Apply",
            icon: <GiTakeMyMoney size={80} color='#fff' />,
            path: "/dashboard/FundPartnersInfo",
        },
        {
            id: 3,
            name: "Draft",
            icon: <RiDraftFill size={80} color='#fff' />,
            path: "/dashboard/draftList",
        },

        {
            id: 5,
            name: "Track",
            icon: <HiDocumentSearch size={80} color='#fff' />,
            path: "/dashboard/track",
        },
        // {
        //     id: 6,
        //     name: "Message",
        //     icon: <MdDrafts size={80} color='#fff' />,
        //     path: "/dashboard/message",
        // },
        // {
        //     id: 7,
        //     name: "Docs Upload",
        //     icon: <FaFileUpload size={80} color='#fff' />,
        //     path: "/dashboard/documentUpload",
        // },
    ];

    const handleNavigator = (data: any) => {
        if (
            data === "/dashboard/createCreditApplication" ||
            data === "/dashboard/message" ||
            data === "/dashboard/fundTransfer"
        ) {
            if (sessionStorage.getItem("custNo") === "null") {
                const notificationData: CommonnotificationProps = {
                    type: "info",
                    msgtitle: "Notification",
                    msgDesc:
                        "There is no active customer to perform this action",
                    api: api,
                };
                openNotificationWithIcon(notificationData);
            } else {
                navigate(data);
            }
        } else {
            navigate(data);
        }
    };

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % 2);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % 2);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + 2) % 2);
    };

    const cardColors = ["#DA9729", "#006c33"];
    const shuffledColors = [...cardColors].sort(() => Math.random() - 0.5);

    return (
        <>
            {contextHolder}
            <div className='main-container'>
                <div className={styles["dashboard-heading"]}>Home</div>
                <div className={styles["dashboard-content"]}>
                    <div className={styles["action-icons-container"]}>
                        {actionIconsList.map(
                            ({ id, name, icon, path }, index) => (
                                <div
                                    key={id}
                                    style={{
                                        backgroundColor:
                                            shuffledColors[
                                                index % shuffledColors.length
                                            ],
                                    }}
                                    className={styles["action-box"]}
                                    onClick={() => handleNavigator(path)}
                                >
                                    <div className={styles["icon-container"]}>
                                        {icon}
                                    </div>
                                    <div className={styles["action-name"]}>
                                        {name}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div className={styles["right-carousel-container"]}>
                        <div
                            className={styles["carousel-wrapper"]}
                            style={{
                                transform: `translateX(-${currentSlide * 50}%)`,
                            }}
                        >
                            <div className={styles["carousel-slide"]}>
                                <img src={croller} alt='Bank Offer 1' />
                            </div>
                            <div className={styles["carousel-slide"]}>
                                <img src={croller} alt='Bank Offer 2' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
