import React, { useState, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import personIcon from "../../assets/icons/person.png";
import emailIcon from "../../assets/icons/email.png";
import mobile from "../../assets/icons/mobile.png";
import password from "../../assets/icons/password.png";
import repeat from "../../assets/icons/repeat.png";
import checkmark from "../../assets/icons/checkmark.png";
import birthday from "../../assets/icons/birthday.png";
import InputField from "../../components/InputFiled/InputField";
import Button from "../../components/Button/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { max_dob, password_regex } from "../../Utils/Constants/constants";
import * as screenNames from "../../Utils/Constants/screennames";
import * as AlertStrings from "../../Utils/Constants/alert";
import { SignUpRequest, useSignUp } from "./signup";
import { notification } from "antd";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import Loader from "../../components/Loader/loader";
import { formatDate } from "../../Utils/UtilityFunctions/utilityFunctions";
import CustomDatePicker from "../../components/CustomDatePicker/customDatePicker";
import { CalendarOutlined } from "@ant-design/icons";
import SimpleReactValidator from "simple-react-validator";

export const Register = () => {
    const navigate = useNavigate();
    const [countryCode, setCountryCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [dob, setDOB] = useState("");
    const [pwd, setPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const signUpMutation = useSignUp();
    const [validator] = useState(new SimpleReactValidator());
    const [, forceUpdate] = useState({});

    const pastDate = new Date(
        new Date().getFullYear() - max_dob,
        new Date().getMonth(),
        new Date().getDate()
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (validator.allValid()) {
            if (pwd === confirmPwd) {
                const registerData: SignUpRequest = {
                    instituteCode:
                        sessionStorage.getItem("instituteCode") || "{}",
                    transmissionTime: Date.now(),
                    birthDate: dob,
                    email: email,
                    failedLoginNo: 0,
                    firstName: firstName,
                    lastName: lastName,
                    mobile: mobileNumber,
                    password: pwd,
                };
                setIsLoading(true);
                const response: any = await signUpMutation.mutateAsync(
                    registerData
                );
                if (response.status === 200) {
                    setIsLoading(false);
                    sessionStorage.setItem(
                        "accessToken",
                        response.data.accessToken
                    );
                    sessionStorage.setItem(
                        "refreshToken",
                        response.data.refreshToken
                    );
                    sessionStorage.setItem(
                        "dbsUserId",
                        response.data.dbsUserId.toString()
                    );
                    navigate(screenNames.VERIFY_OTP);
                } else {
                    setIsLoading(false);
                    const notificationData: CommonnotificationProps = {
                        type: "error",
                        msgtitle: "",
                        msgDesc: response.errorMessage,
                        api: api,
                    };
                    openNotificationWithIcon(notificationData);
                }
            } else {
                const notificationData: CommonnotificationProps = {
                    type: "error",
                    msgtitle: "Error",
                    msgDesc: AlertStrings.PASSWORD_MISMATCH_ALERTS,
                    api: api,
                };
                openNotificationWithIcon(notificationData);
            }
        } else {
            validator.showMessages();
            forceUpdate({});
        }
    };

    return (
        <>
            {contextHolder}
            <Loader loading={isLoading} />
            <div className={styles["main"]}>
                <div className={styles["register-header"]}>
                    Create an Account
                </div>
                <form
                    onSubmit={handleSubmit}
                    className={styles["register-form"]}
                >
                    <div className={styles["register-input-pair"]}>
                        <div className={styles["fName"]}>
                            <InputField
                                image={personIcon}
                                placeholder={"First Name"}
                                type={"text"}
                                onChange={(event) => {
                                    setFirstName(event.target.value);
                                }}
                                value={firstName}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "firstName",
                                    firstName,
                                    "required"
                                )}
                            </span>
                        </div>
                        <div className={styles["lName"]}>
                            <InputField
                                placeholder={"Last Name"}
                                type={"text"}
                                onChange={(event) => {
                                    setLastName(event.target.value);
                                }}
                                value={lastName}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "lastName",
                                    lastName,
                                    "required"
                                )}
                            </span>
                        </div>
                        <div className={styles["email"]}>
                            <InputField
                                image={emailIcon}
                                placeholder={"Email"}
                                type={"email"}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                                value={email}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "email",
                                    email,
                                    "required|email"
                                )}
                            </span>
                        </div>
                        <div className={styles["birthDate"]}>
                            <CustomDatePicker
                                value={dob}
                                placeholder={"Birth Date"}
                                onChange={(date: any, dateString: any) => {
                                    setDOB(dateString);
                                }}
                                icon={<CalendarOutlined />}
                            />
                        </div>
                        <div className={styles["country"]}>
                            <PhoneInput
                                inputClass={styles["tel-input"]}
                                country={"eg"}
                                enableSearch={true}
                                value={countryCode}
                                onChange={(phone) => setCountryCode(phone)}
                            />
                        </div>

                        <div className={styles["mobile"]}>
                            <InputField
                                image={mobile}
                                placeholder={"Mobile"}
                                type={"tel"}
                                value={mobileNumber}
                                onChange={(event) =>
                                    setMobileNumber(event.target.value)
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "mobileNumber ",
                                    mobileNumber,
                                    "required|min:11|max:11|phone"
                                )}
                            </span>
                        </div>

                        <div className={styles["password"]}>
                            <InputField
                                image={password}
                                placeholder={"Password"}
                                type={"password"}
                                value={pwd}
                                onChange={(event) => setPwd(event.target.value)}
                                pattern={password_regex}
                                title={
                                    "Password should not be less than 8 characters and it should contain at least one number and one special charater"
                                }
                            />
                            <span className='text-error'>
                                {validator.message("password", pwd, "required")}
                            </span>
                        </div>
                        <div className={styles["confirmPwd"]}>
                            <InputField
                                image={repeat}
                                placeholder={"Repeat Password"}
                                type={"password"}
                                value={confirmPwd}
                                onChange={(event) =>
                                    setConfirmPwd(event.target.value)
                                }
                                pattern={password_regex}
                                title={
                                    "Password should not be less than 8 characters and it should contain at least one number and one letter"
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "Repeat password",
                                    confirmPwd,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["register-button"]}>
                        <div
                            className={styles["register-button-icon-container"]}
                        >
                            <Button
                                text={"Create"}
                                type={"submit"}
                                disabled={false}
                            />
                            <img src={checkmark} alt='' />
                        </div>
                    </div>
                    <div className={styles["backto-login"]}>
                        <p
                            onClick={() => {
                                navigate({ pathname: screenNames.SIGN_IN });
                            }}
                        >
                            Back to Sign In
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};
