import React, {
    useState,
    ChangeEvent,
    useRef,
    useEffect,
    useCallback,
} from 'react';
import styles from './otpVerification.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpVerificationImage from '../../assets/icons/OTPverification.png';
import Button from '../../components/Button/Button';
import {
    UserDetailRequest,
    ValidateOTP,
    useRequestOTP,
    useValidateOTP,
} from './otp';
import { notification } from 'antd';
import Loader from '../../components/Loader/loader';
import CountdownTimer from '../../components/CountdownTimer/countDownTimer';
import * as screenNames from '../../Utils/Constants/screennames';
import openNotificationWithIcon, {
    CommonnotificationProps,
} from '../../components/Notification/commonnotification';

const OtpVerification = () => {
    const navigate = useNavigate();
    const [otp, setOTP] = useState(['', '', '', '']);
    const otpInputRef = useRef<(HTMLInputElement | null)[]>([
        null,
        null,
        null,
        null,
    ]);

    const resentAttempts = 2;
    const [isTimerVisible, setTimerVisible] = useState(false);
    const [resentOtpCount, setResentOtpCount] = useState(0);
    const requestOTPMutation = useRequestOTP();
    const verifyOTPMutation = useValidateOTP();
    const [isLoading, setIsLoading] = useState(false);
    const [isDisableVerifyBtn, setIsDisableVerifyBtn] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const location = useLocation();

    useEffect(() => {
        if (!sessionStorage.getItem('dbsUserId')) {
            navigate(screenNames.SIGN_IN);
        }
    }, []);

    useEffect(() => {
        // disable verify button if otp not entered
        const isOtpEntered = otp.filter((value) => value === '');
        if (isOtpEntered.length === 0) {
            setIsDisableVerifyBtn(false);
        } else {
            setIsDisableVerifyBtn(true);
        }
    }, [otp]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const updatedOTP = [...otp];
        updatedOTP[index] = e.target.value;
        setOTP(updatedOTP);

        // Move to the next input field if there is a value
        if (e.target.value && index < otp.length - 1) {
            const nextIndex = index + 1;
            otpInputRef.current[nextIndex]?.focus();
        }
    };

    const handleBackSpace = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.keyCode === 8 && index < otp.length) {
            if (otp[otp.length - 1] === '') {
                const prevIndex = index - 1;
                otpInputRef.current[prevIndex]?.focus();
            }
        }
    };

    const requestOTP = useCallback(async () => {
        setResentOtpCount((prevCount) => prevCount + 1);
        if (resentOtpCount === resentAttempts) {
            setTimerVisible(false);
        }

        const request: UserDetailRequest = {
            instituteCode: sessionStorage.getItem('instituteCode') || '{}',
            transmissionTime: Date.now(),
            dbsUserId: sessionStorage.getItem('dbsUserId') || '',
        };
        setIsLoading(true);
        const response: any = await requestOTPMutation.mutateAsync(request);
        if (response.status === 200) {
            setIsLoading(false);
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
        setTimerVisible(true);
    }, [
        resentOtpCount,
        setTimerVisible,
        setIsLoading,
        requestOTPMutation,
        api,
    ]);

    useEffect(() => {
        const otpRequested = sessionStorage.getItem('otpRequested');
        if (!otpRequested) {
            requestOTP();
            sessionStorage.setItem('otpRequested', 'true');
        }
        return () => {
            requestOTPMutation.reset();
        };
    }, [requestOTP, requestOTPMutation]);

    const handleResendOTP = () => {
        requestOTP();
    };

    const validateOTP = async () => {
        const request: ValidateOTP = {
            instituteCode: sessionStorage.getItem('instituteCode') || '',
            transmissionTime: Date.now(),
            dbsUserId: sessionStorage.getItem('dbsUserId') || '',
            securityCd: otp.join('').toString(),
        };
        setIsLoading(true);
        const response: any = await verifyOTPMutation.mutateAsync(request);

        if (response.status === 200) {
            setIsLoading(false);
            if (location.state?.params?.isFromForgotUser) {
                navigate(screenNames.CHANGE_PASSWORD);
            } else {
                const notificationData: CommonnotificationProps = {
                    type: 'success',
                    msgtitle: 'Success',
                    msgDesc:
                        'User registered successfully !. Please login to continue',
                    api: api,
                };
                openNotificationWithIcon(notificationData);
                setTimeout(() => {
                    navigate({ pathname: screenNames.SIGN_IN });
                }, 3000);
            }
        } else {
            setIsLoading(false);
            const notificationData: CommonnotificationProps = {
                type: 'error',
                msgtitle: '',
                msgDesc: response.errorMessage,
                api: api,
            };
            openNotificationWithIcon(notificationData);
            setOTP(['', '', '', '']);
        }
    };

    return (
        <>
            {contextHolder}
            <div className={styles['main']}>
                <Loader loading={isLoading} />
                <div className={styles['otp-header']}>OTP Verification</div>
                <div className={styles['image_container']}>
                    <img
                        className={styles['otp_image']}
                        src={OtpVerificationImage}
                        alt=""
                    />
                    <p>
                        We've sent the code to your registration email address.
                    </p>
                </div>
                <div className={styles['text_container']}>
                    {otp.map((value, index) => (
                        <input
                            className={styles['otp_Input_field']}
                            key={index}
                            type="text"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleInputChange(e, index)}
                            ref={(input) =>
                                (otpInputRef.current[index] = input)
                            }
                            onKeyDown={(e) => handleBackSpace(e, index)}
                        />
                    ))}
                </div>
                <Button
                    text={'Verify'}
                    type={'button'}
                    disabled={isDisableVerifyBtn}
                    onClick={validateOTP}
                />
                <p className={styles['resend_otp_previous_text']}>
                    Haven't received the Verification code?
                </p>
                {!isTimerVisible && resentOtpCount < resentAttempts + 1 && (
                    <p
                        className={styles['resend_otp_text']}
                        onClick={handleResendOTP}
                    >
                        Resend OTP
                    </p>
                )}
                {isTimerVisible ? (
                    <CountdownTimer
                        duration={10}
                        onTimerEnd={() => {
                            setTimerVisible(false);
                        }}
                    />
                ) : (
                    ''
                )}
            </div>
        </>
    );
};

export default OtpVerification;
