import { useEffect, useState } from 'react';
import styles from './login.module.css';
import personIcon from '../../assets/icons/person.png';
import password from '../../assets/icons/password.png';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputFiled/InputField';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/loader';
// import { password_regex } from "../../Utils/Constants/constants";
import { useLogin } from './signin';
import { LoginCredentialsProps } from '../../interfaces';
import { notification } from 'antd';
import openNotificationWithIcon, {
    CommonnotificationProps,
} from '../../components/Notification/commonnotification';
import DialogueBox, { DialogueBoxProps } from '../../components/Model/model';
import * as screenNames from '../../Utils/Constants/screennames';
import { useCustomerContext } from '../../context/customerDetailsContext';
import { useFindAppDraft } from '../Dashboard/Draft/draft';

export const Login = () => {
    const navigate = useNavigate();
    const [usernameState, setUsernameState] = useState<string>('');
    const [passwordState, setPasswordState] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const loginMutation = useLogin();
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
    const useFindAppDraftMutation = useFindAppDraft();
    const { setCustomerData } = useCustomerContext();

    useEffect(() => {
        sessionStorage.clear();
        const basicInfo = {
            email: '',
            mobile: '',
            strDateOfBirth: '',
            nextOfKin: '',
            spouseName: '',
            titleCd: null,
            lastName: '',
            middleName: '',
            firstName: '',
            customerType: '',
            nationalityCd: null,
            industryId: '',
            countryOfResidenceId: '',
            maritalStatus: '',

            countryOfBirthId: '',
            gender: '',
            occupationCd: '',
            employmentFlag: false,
            noOfDependents: '',

            organisationName: '',
            registrationNumber: '',
            strRegistrationDate: '',
        };

        const addressInfo = {
            primaryAddressCity: '',
            primaryAddressLine1: '',
            primaryAddressLine2: '',
            primaryAddressLine3: '',
            primaryAddressLine4: '',
            primaryAddressState: '',
            strFromDate: '',
            primaryAddressCountryCd: '',
            addressTypeId: '',
        };

        const otherInfo = {
            openingReasonCd: '',
            marketingCampaignCd: '',
            sourceOfFundCd: '',
            amountUnit: '',
            monthlyIncomeAmount: 0,
        };
        setCustomerData((prev) => ({
            ...prev,
            basicInfoData: basicInfo,
            addressInfoData: addressInfo,
            otherInfoData: otherInfo,
            customerCategory: '',
            identificationInfoData: null,
            documentInfodata: null,
            strphotoGraphImage: null,
            strsignatureImage: null,
            addDocumentFlag: false,
            customerDraftFlag: false,
        }));
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setIsLoading(true);
        const credentials: LoginCredentialsProps = {
            instituteCode: 'DBS01',
            transmissionTime: Date.now(),
            userLoginId: usernameState,
            password: passwordState,
        };
        const data: any = await loginMutation.mutateAsync(credentials);

        if (data.status === 200) {
            setIsLoading(false);
            sessionStorage.setItem('accessToken', data.data.accessToken);
            sessionStorage.setItem('refreshToken', data.data.refreshToken);
            sessionStorage.setItem('dbsUserId', data.data.dbsUserId.toString());
            sessionStorage.setItem('email', data.data.email);
            sessionStorage.setItem('mobile', data.data.mobile);
            sessionStorage.setItem('custId', data.data.customerId);
            sessionStorage.setItem('custNo', data.data.customerNumber);

            if (data.data.emlVerifyFlag) {
                const request: any = {
                    instituteCode:
                        sessionStorage.getItem('instituteCode') || '{}',
                    transmissionTime: Date.now(),
                    dbsUserId: data.data.dbsUserId,
                };
                setIsLoading(true);
                const response: any = await useFindAppDraftMutation.mutateAsync(
                    request
                );
                if (response.status === 200) {
                    setIsLoading(false);
                    if (response.data?.applData?.length > 0) {
                        sessionStorage.setItem('customerDraftFlag', 'true');
                        setCustomerData((prev) => ({
                            ...prev,
                            customerDraftFlag: true,
                        }));
                        navigate('/dashboard');
                    } else {
                        navigate('/dashboard/customerType');
                    }
                } else {
                    setIsLoading(false);
                }
            } else {
                const notificationData: CommonnotificationProps = {
                    type: 'success',
                    msgtitle: 'Success',
                    msgDesc: 'you are successFully Loggedin',
                    api: api,
                };
                openNotificationWithIcon(notificationData);

                setModelData({
                    title: 'Confirmation',
                    content: 'Your Email is not verified yet!',
                    okText: 'VerifyNow',
                    cancelText: 'Close',
                    onOk: () => {
                        navigate(screenNames.VERIFY_OTP);
                    },
                    onCancel: true,
                });
                setModelOpen(true);
            }
        } else {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: 'error',
                msgtitle: '',
                msgDesc: data.errorMessage,
                api: api,
            };
            openNotificationWithIcon(notificationData);
        }
    };
    return (
        <>
            {contextHolder}
            <div className={styles['main']}>
                <DialogueBox
                    open={modelOpen}
                    DialogueBoxProps={modelData}
                    setOpen={setModelOpen}
                />
                <Loader loading={isLoading} />
                <div className={styles['login-header']}>
                    Login to Your Account
                </div>
                <form onSubmit={handleSubmit} className={styles['login-form']}>
                    <InputField
                        image={personIcon}
                        placeholder={'Username'}
                        type={'text'}
                        required={true}
                        onChange={(event) => {
                            setUsernameState(event.target.value);
                        }}
                        value={usernameState}
                    />

                    <InputField
                        image={password}
                        placeholder={'Password'}
                        type={'password'}
                        required={true}
                        onChange={(event) => {
                            setPasswordState(event.target.value);
                        }}
                        value={passwordState}
                    />
                    <div>
                        <p
                            className={styles['forgot-pwd']}
                            onClick={() => {
                                navigate({
                                    pathname: screenNames.FORGOT_PASSWORD,
                                });
                            }}
                        >
                            Forgot Password?
                        </p>
                    </div>

                    <div className={styles['submitBtn']}>
                        <Button
                            text={'Sign In'}
                            type={'submit'}
                            disabled={false}
                        />
                    </div>
                    <div className={styles['signin-portion']}>
                        <p>Don't have an account?</p>
                        <p
                            onClick={() => {
                                navigate({ pathname: screenNames.SIGN_UP });
                            }}
                        >
                            Sign Up
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};
