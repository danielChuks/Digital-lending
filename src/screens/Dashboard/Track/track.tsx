import React, { useState, useEffect } from 'react';
import styles from './track.module.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader/loader';
import { useTrackDBSCustomer } from '../Draft/draft';
import openNotificationWithIcon, {
    CommonnotificationProps,
} from '../../../components/Notification/commonnotification';
import { notification } from 'antd';
import DialogueBox, { DialogueBoxProps } from '../../../components/Model/model';
import { useCustomerContext } from '../../../context/customerDetailsContext';

export const Track = () => {
    const navigate = useNavigate();
    const useTrackDBSCustomerMutation = useTrackDBSCustomer();
    const { CustomerData, setCustomerData } = useCustomerContext();
    const [trackListData, setTrackListData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [modelData, setModelData] = useState<DialogueBoxProps>({
        title: '',
        content: '',
        okText: '',
        cancelText: '',
        onOk: '',
        onCancel: true,
    });
    const [modelOpen, setModelOpen] = useState(false);

    useEffect(() => {
        getTrackListData();
        if (sessionStorage.getItem('customerDraftFlag') === 'true') {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftFlag: true,
            }));
        }
    }, []);

    const getTrackListData = async () => {
        setIsLoading(true);
        const request: any = {
            dbsUserId: sessionStorage.getItem('dbsUserId'),
        };
        const response: any = await useTrackDBSCustomerMutation.mutateAsync(
            request
        );
        if (response.status === 200) {
            setIsLoading(false);

            if (response.data?.dbsTrackCustomerData?.length > 0) {
                setTrackListData([]);
                response.data?.dbsTrackCustomerData.map((data: any) => {
                    setTrackListData((prev: any) => [...prev, data]);
                });
            }
        } else if (
            response.errorCode === 'CI_JWT_001' ||
            response.errorCode === 'CI_JWT_002'
        ) {
            const notificationData: CommonnotificationProps = {
                type: 'info',
                msgtitle: 'Notification',
                msgDesc: 'Your session is over, Please login again',
                api: api,
            };
            openNotificationWithIcon(notificationData);
            setTimeout(() => {
                navigate({ pathname: '/login' });
            }, 3000);
        } else {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: 'error',
                msgtitle: '',
                msgDesc: response.errorMessage,
                api: api,
            };
            openNotificationWithIcon(notificationData);
        }
    };

    const HandleViewDraft = (id: any, applType: any) => {
        if (applType === 'CUSTOMER') {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftReadOnlyFlag: true,
            }));
            sessionStorage.setItem('customerDraftReadOnlyFlag', 'true');
            sessionStorage.setItem('dbsCustApplId', id);
            navigate('/dashboard/createCustomer');
        }
        if (applType === 'CREDIT') {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftReadOnlyFlag: true,
            }));
            sessionStorage.setItem('customerDraftReadOnlyFlag', 'true');
            sessionStorage.setItem('dbsCustApplId', id);
            navigate('/dashboard/createCreditApplication');
        }
    };

    return (
        <div className={'main-container'}>
            <Loader loading={isLoading} />
            <div className={'main-heading'}>Track</div>
            <div className={styles['Account-content']}>
                <div className={styles['account-action-container']}>
                    {trackListData.length > 0 ? (
                        trackListData?.map(
                            (
                                {
                                    customerName,
                                    customerNumber,
                                    customerId,
                                    coreStatus,
                                    systemTime,
                                    credit_ref_no,
                                    applicationType,
                                    dbsCustApplId,
                                },
                                index
                            ) => (
                                <div
                                    key={index}
                                    className={styles['account-action-box']}
                                    onClick={() =>
                                        HandleViewDraft(
                                            dbsCustApplId,
                                            applicationType
                                        )
                                    }
                                >
                                    <div
                                        className={
                                            styles['account-action-header']
                                        }
                                    >
                                        {applicationType}
                                    </div>
                                    <div
                                        className={
                                            styles['account-action-content']
                                        }
                                    >
                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Customer Name</p>
                                            <b className={styles['green-text']}>
                                                {customerName}
                                            </b>
                                        </div>

                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Customer Number</p>
                                            <b className={styles['green-text']}>
                                                {customerNumber}
                                            </b>
                                        </div>
                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Created Date</p>
                                            <b className={styles['green-text']}>
                                                {systemTime}
                                            </b>
                                        </div>
                                        {applicationType === 'CREDIT' ? (
                                            <div
                                                className={
                                                    styles['text-container']
                                                }
                                            >
                                                <p>CreditApplRefNo</p>
                                                <b
                                                    className={
                                                        styles['green-text']
                                                    }
                                                >
                                                    {credit_ref_no}
                                                </b>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Status</p>
                                            <b className={styles['green-text']}>
                                                {coreStatus === 'S'
                                                    ? 'Submitted'
                                                    : coreStatus === 'I'
                                                    ? 'Inactive'
                                                    : coreStatus === 'A'
                                                    ? 'Active'
                                                    : coreStatus === 'C'
                                                    ? 'Closed'
                                                    : ''}
                                            </b>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <>
                            <p></p>
                            <p className={styles['nodata']}>No Track to Show</p>
                            <p></p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
