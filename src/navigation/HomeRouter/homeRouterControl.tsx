import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./homeRouterControl.module.css";
import PalmsLogo from "../../assets/icons/bank_logo.png";
import UserLogo from "../../assets/icons/user-circle.svg";
import { MenuProps, Modal, notification } from "antd";
import { Dropdown } from "antd";
import { Breadcrumb } from "antd";
import * as screenNames from "../../Utils/Constants/screennames";
import { useEffect, useState } from "react";
import { useCustomerContext } from "../../context/customerDetailsContext";
import ViewProfile from "../../screens/Profile/viewProfile";
import { ChangePassword } from "../../screens/Profile/changePassword";
import { useFindDbsUser } from "../../screens/Signup/signup";
import { useUpdateUserProfile } from "../../screens/ForgotPassword/forgotpasswordService";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../components/Notification/commonnotification";
import Loader from "../../components/Loader/loader";

const breadcrumbNameMap: Record<string, string> = {
    "/dashboard": "Home",
    "/dashboard/account": "Account",
    "/dashboard/account/accountStatement": "Statement",
    "/dashboard/draftList": "Draft",
};

export const HomeRouterControl = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { CustomerData, setCustomerData } = useCustomerContext();
    const [modelData, setModelData] = useState<any>();
    const [modelOpen, setModelOpen] = useState(false);
    const mutaion = useUpdateUserProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const findDbsUser = useFindDbsUser();
    const [userName, setUserName] = useState<any>();
    const [profileData, setProfileData] = useState<any>();

    const pathSnippets = location.pathname.split("/").filter((i) => i);

    useEffect(() => {
        getProfileInfo();
        if (sessionStorage.getItem("dbsUserId") === "null") {
            navigate(screenNames.SIGN_IN);
        }
    }, []);

    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
        return {
            key: url,
            title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
        };
    });

    /************ Get the user Profile Information *******************/

    const getProfileInfo = async () => {
        const registerData: any = {
            dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
        };

        setIsLoading(true);
        const response: any = await findDbsUser.mutateAsync(registerData);
        if (response.status === 200) {
            setIsLoading(false);
            setUserName(
                response.data?.firstName + " " + response.data?.lastName
            );
            setProfileData(response.data);
        } else if (
            response.errorCode === "CI_JWT_001" ||
            response.errorCode === "CI_JWT_002"
        ) {
            setIsLoading(false);
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
            const notificationData: CommonnotificationProps = {
                type: "error",
                msgtitle: "Error",
                msgDesc: response.errorMessage,
                api: api,
            };
            openNotificationWithIcon(notificationData);
        }
    };

    /************ Update the user Profile Information *******************/

    const updateProfile = async (data: any) => {
        const registerData: any = {
            dbsUserId: Number(sessionStorage.getItem("dbsUserId")),
            failedLoginNo: 0,
            ...data,
        };
        const response: any = await mutaion.mutateAsync(registerData);
        if (response.status === 200) {
            const notificationData: CommonnotificationProps = {
                type: "success",
                msgtitle: "Success",
                msgDesc: "Profile Data updated",
                api: api,
            };
            openNotificationWithIcon(notificationData);
            getProfileInfo();
            setModelOpen(false);
        } else if (
            response.errorCode === "CI_JWT_001" ||
            response.errorCode === "CI_JWT_002"
        ) {
            setIsLoading(false);
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
            const notificationData: CommonnotificationProps = {
                type: "error",
                msgtitle: "Error",
                msgDesc: response.errorMessage,
                api: api,
            };
            openNotificationWithIcon(notificationData);
        }
        return true;
    };

    const HandleProfile = () => {
        setModelData(
            <ViewProfile
                profileInfoData={profileData}
                updateProfile={updateProfile}
            />
        );
        setModelOpen(true);
    };

    const HandlePasswordChange = () => {
        setModelData(<ChangePassword updateProfile={updateProfile} />);
        setModelOpen(true);
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: <p onClick={HandleProfile}>Profile</p>,
        },
        {
            key: "2",
            label: <p onClick={HandlePasswordChange}>Change Password</p>,
        },
        {
            key: "3",
            label: (
                <a
                    onClick={() => {
                        sessionStorage.clear();
                        navigate("/");
                    }}
                >
                    Log out
                </a>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Loader loading={isLoading} />
            <div>
                <Modal
                    open={modelOpen}
                    footer={null}
                    onCancel={() => {
                        setModelOpen(false);
                    }}
                    className={styles["profile-model"]}
                >
                    {modelData}
                </Modal>
            </div>
            <header className={styles["Header-container"]}>
                <div className='logo-container'>
                    <img
                        className={styles["palms-logo"]}
                        src={PalmsLogo}
                        alt='palms logo'
                    />
                </div>
                <div className={styles["nav-container"]}>
                    <p className={styles["userName"]}>{userName}</p>
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                        placement='bottomRight'
                        arrow
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <img
                                className={styles["user-logo"]}
                                src={UserLogo}
                                alt='user logo'
                            />
                        </a>
                    </Dropdown>
                </div>
            </header>
            <div className={styles[""]}>
                {pathSnippets.length > 1 && CustomerData.customerDraftFlag ? (
                    <Breadcrumb
                        className={styles["custom-breadcrumb"]}
                        items={breadcrumbItems}
                    />
                ) : (
                    ""
                )}
                <Outlet />
            </div>
        </>
    );
};
