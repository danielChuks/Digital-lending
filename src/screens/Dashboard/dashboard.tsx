import React, { useEffect } from 'react';
import styles from './dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useCustomerContext } from '../../context/customerDetailsContext';
import { useCreditApplicationDataContext } from '../../context/creditApplDetailsContext';
import openNotificationWithIcon, {
    CommonnotificationProps,
} from '../../components/Notification/commonnotification';
import { notification } from 'antd';
import { GiFamilyHouse } from 'react-icons/gi';
import { GiTakeMyMoney } from 'react-icons/gi';

import { RiDraftFill } from 'react-icons/ri';
import { FaMoneyBillWheat } from 'react-icons/fa6';
import { HiDocumentSearch } from 'react-icons/hi';
import { MdDrafts } from 'react-icons/md';

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

        if (sessionStorage.getItem('customerDraftFlag') === 'true') {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftFlag: true,
            }));
        }

        setCustomerData((prev) => ({
            ...prev,
            customerDraftReadOnlyFlag: false,
        }));
        sessionStorage.setItem('customerDraftReadOnlyFlag', 'false');

        setCreditApplDataFields_context({
            basicInfo: {},
            documentInfodata: [],
            collateralinfoData: [],
            loading: false,
        });
        sessionStorage.removeItem('dbsCustApplId');
        setCreditApplDataFields_context((prev) => ({
            ...prev,
            addDocumentFlag: false,
        }));
    }, []);

    const actionIconsList = [
        {
            id: 1,
            name: 'Account',
            icon: <GiFamilyHouse size={80} color="#4d8b6a" />,
            path: '/dashboard/account',
        },
        {
            id: 2,
            name: 'Apply',
            icon: <GiTakeMyMoney size={80} color="#4d8b6a" />,
            path: '/dashboard/createCreditApplication',
        },
        {
            id: 3,
            name: 'Draft',
            icon: <RiDraftFill size={80} color="#4d8b6a" />,
            path: '/dashboard/draftList',
        },
        {
            id: 4,
            name: 'Transfer',
            icon: <FaMoneyBillWheat size={80} color="#4d8b6a" />,
            path: '/dashboard/fundTransfer',
        },
        {
            id: 5,
            name: 'Track',
            icon: <HiDocumentSearch size={80} color="#4d8b6a" />,
            path: '/dashboard/track',
        },
        {
            id: 6,
            name: 'Message',
            icon: <MdDrafts size={80} color="#4d8b6a" />,
            path: '/dashboard/message',
        },
    ];

    const handleNavigator = (data: any) => {
        if (
            data === '/dashboard/createCreditApplication' ||
            data === '/dashboard/message' ||
            data === '/dashboard/fundTransfer'
        ) {
            if (sessionStorage.getItem('custNo') === 'null') {
                const notificationData: CommonnotificationProps = {
                    type: 'info',
                    msgtitle: 'Notification',
                    msgDesc:
                        'There is no active customer to perform this action',
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

    return (
        <>
            {contextHolder}
            <div className="main-container">
                <div className={styles['dashboard-heading']}>Dashboard</div>
                <section className={styles['dashboard-content']}>
                    <div className={styles['action-icons-container']}>
                        {actionIconsList.map(({ id, name, icon, path }) => (
                            <div
                                key={id}
                                className={styles['action-box']}
                                onClick={() => handleNavigator(path)}
                            >
                                <div className={styles['icon-container']}>
                                    {icon}
                                </div>
                                <div className={styles['action-name']}>
                                    {name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles['right-carousel-container']}>
                        <iframe
                            title="Bank Offers"
                            src={
                                'http://10.100.80.140:9090/rubikonciapplication/app/dbs/userservice/getBankOffers'
                            }
                            style={{ border: '0' }}
                        ></iframe>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;
