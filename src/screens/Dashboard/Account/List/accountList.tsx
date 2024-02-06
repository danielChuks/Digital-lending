import React, { useState, useEffect } from 'react';
import styles from './accountList.module.css';
import { useNavigate } from 'react-router-dom';
import { UserDetailRequest } from '../../../OtpVerification/otp';
import { useAccountList } from '../account';
import Button from '../../../../components/Button/Button';
import Loader from '../../../../components/Loader/loader';
import openNotificationWithIcon, {
    CommonnotificationProps,
} from '../../../../components/Notification/commonnotification';
import { notification } from 'antd';
import { useCustomerContext } from '../../../../context/customerDetailsContext';

export const AccountList = () => {
    const navigate = useNavigate();
    const accountListMutation = useAccountList();
    const [accountListData, setAccountListData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { CustomerData, setCustomerData } = useCustomerContext();

    useEffect(() => {
        if (sessionStorage.getItem('customerDraftFlag') === 'true') {
            setCustomerData((prev) => ({
                ...prev,
                customerDraftFlag: true,
            }));
        }
        getAccountListData();
    }, []);

    const getAccountListData = async () => {
        setIsLoading(true);
        const requestdata: UserDetailRequest = {
            instituteCode: sessionStorage.getItem('instituteCode') || '{}',
            transmissionTime: Date.now(),
            dbsUserId: sessionStorage.getItem('dbsUserId') || '{}',
        };
        const data: any = await accountListMutation.mutateAsync(requestdata);
        if (data.status === 200) {
            setIsLoading(false);
            let mergedArray = [
                ...data.data.dpAcctDetails,
                ...data.data.lnAcctDetails,
            ];
            setAccountListData(mergedArray);
            setIsLoading(false);
        } else if (
            data.errorCode === 'CI_JWT_001' ||
            data.errorCode === 'CI_JWT_002'
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
                msgtitle: data.errorCode,
                msgDesc: data.errorCode,
                api: api,
            };
            openNotificationWithIcon(notificationData);
        }
    };

    const handleShowStatement = (id: number) => {
        const selectedAccount = accountListData.filter((data, index) =>
            index === id ? data : 0
        );
        navigate('/dashboard/account/accountStatement', {
            state: { selectedAccount },
        });
    };
    return (
        <>
            {contextHolder}
            <div className={'main-container'}>
                <Loader loading={isLoading} />
                <div className={'main-heading'}>Accounts</div>
                <section className={styles['Account-content']}>
                    <div className={styles['account-action-container']}>
                        {accountListData?.map(
                            (
                                {
                                    acctNo,
                                    acctName,
                                    status,
                                    productCategory,
                                    productDesc,
                                    outstandingAmount,
                                    emi,
                                    availableBalance,
                                    nextInstalmentAmount,
                                    nextInstalmentDate,
                                    tenure,
                                    nextInstalmentDays,
                                },
                                index
                            ) => (
                                <div
                                    key={index}
                                    className={styles['account-action-box']}
                                    onClick={() => handleShowStatement(index)}
                                >
                                    <div
                                        className={
                                            styles['account-action-header']
                                        }
                                    >
                                        {productDesc}
                                    </div>
                                    <div
                                        className={
                                            productCategory === 'DP'
                                                ? styles[
                                                      'account-action-content-dpAccount'
                                                  ]
                                                : styles[
                                                      'account-action-content-lnAccount'
                                                  ]
                                        }
                                    >
                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Account Number</p>
                                            <b className={styles['green-text']}>
                                                {acctNo}
                                            </b>
                                        </div>
                                        {productCategory === 'DP' ? (
                                            <div
                                                className={
                                                    styles['text-container']
                                                }
                                            >
                                                <p>Account Balance</p>
                                                <b
                                                    className={
                                                        styles['green-text']
                                                    }
                                                >
                                                    {availableBalance}
                                                </b>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {productCategory === 'LN' ? (
                                            <>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>Principal Balance</p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {outstandingAmount}
                                                    </b>
                                                </div>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>Due Amount</p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {emi}
                                                    </b>
                                                </div>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>Term</p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {tenure}
                                                    </b>
                                                </div>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>
                                                        Next Instalment Amount
                                                    </p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {nextInstalmentAmount}
                                                    </b>
                                                </div>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>Next Instalment Date</p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {nextInstalmentDate}
                                                    </b>
                                                </div>
                                                <div
                                                    className={
                                                        styles['text-container']
                                                    }
                                                >
                                                    <p>
                                                        Days to Next Instalment
                                                    </p>
                                                    <b
                                                        className={
                                                            styles['green-text']
                                                        }
                                                    >
                                                        {nextInstalmentDays}
                                                    </b>
                                                </div>
                                            </>
                                        ) : (
                                            ''
                                        )}

                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Account Type</p>
                                            <b className={styles['green-text']}>
                                                {productCategory === 'DP'
                                                    ? 'Deposit'
                                                    : 'Loan'}
                                            </b>
                                        </div>
                                        <div
                                            className={styles['text-container']}
                                        >
                                            <p>Status</p>
                                            <b className={styles['green-text']}>
                                                {status}
                                            </b>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    <div className={styles['buton-container']}>
                        <Button
                            text={'Back'}
                            type={'button'}
                            disabled={false}
                            buttonType={'back'}
                            icon={true}
                            onClick={() => navigate('/dashboard')}
                        />
                    </div>
                </section>
            </div>
        </>
    );
};
