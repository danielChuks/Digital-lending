import React, {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import styles from "../createCustomer.module.css";
import InputField from "../../../components/InputFiled/InputField";
import CustomSelector from "../../../components/CustomSelector/customSelector";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import CustomDatePicker from "../../../components/CustomDatePicker/customDatePicker";
import { usePickListContext } from "../../../context/pickListDataContext";
import { useGetPicklist } from "../createCustomerService";
import SimpleReactValidator from "simple-react-validator";
import openNotificationWithIcon, {
    CommonnotificationProps,
} from "../../../components/Notification/commonnotification";
import { notification } from "antd";
import { useNavigate } from "react-router";

// Define the props for the ChildComponent
type ChildComponentProps = {};

// Define the methods that will be exposed via the ref
interface ChildMethods {
    handleValidation: () => void;
}

const AddressInfo = forwardRef<ChildMethods, ChildComponentProps>(
    (props, ref: any) => {
        const { CustomerData, setCustomerData } = useCustomerContext();
        const { picklistData, setPicklistData } = usePickListContext();
        const [states, setStates] = useState<any>();
        const [cites, setCites] = useState<any>();
        const picklistMutation = useGetPicklist();
        const [validator] = useState(new SimpleReactValidator());
        const isValidated = false;
        const [api, contextHolder] = notification.useNotification();
        const navigate = useNavigate();

        const fetchStates = async () => {
            const payload = {
                instituteCode: "DBS01",
                transmissionTime: Date.now(),
                category: "FETCH_STATE",
                subCategory:
                    CustomerData.addressInfoData.primaryAddressCountryCd,
            };
            const data = await picklistMutation.mutateAsync(payload);
            if (data.status === 200) {
                if (data.data.pickListMap.FETCH_STATE) {
                    let temp: { value: any; label: any }[] = [];
                    data.data.pickListMap.FETCH_STATE?.map(
                        (data: { listKey: any; listDesc: any }) => {
                            temp.push({
                                value: data.listKey,
                                label: data.listDesc,
                            });
                        }
                    );
                    setStates(temp);
                }
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
            }
        };

        const fetchCities = async () => {
            const payload = {
                instituteCode: "DBS01",
                transmissionTime: Date.now(),
                category: "FETCH_CITY",
                subCategory: CustomerData.addressInfoData.primaryAddressState,
            };
            const data = await picklistMutation.mutateAsync(payload);
            if (data.status === 200) {
                if (data.data.pickListMap.FETCH_CITY) {
                    let temp: { value: any; label: any }[] = [];
                    data.data.pickListMap.FETCH_CITY?.map(
                        (data: { listKey: any; listDesc: any }) => {
                            temp.push({
                                value: data.listKey,
                                label: data.listDesc,
                            });
                        }
                    );
                    setCites(temp);
                }
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
            }
        };

        useEffect(() => {
            fetchStates();
        }, [CustomerData.addressInfoData.primaryAddressCountryCd]);

        useEffect(() => {
            fetchCities();
        }, [CustomerData.addressInfoData.primaryAddressState]);

        const handleAddressInfo = ({
            target: { value, name },
        }: React.ChangeEvent<HTMLInputElement>) => {
            setCustomerData((prev) => ({
                ...prev,
                addressInfoData: { ...prev.addressInfoData, [name]: value },
            }));
        };

        const handleSelector = (
            value: React.MouseEvent<Element, MouseEvent>,
            name: string
        ) => {
            setCustomerData((prev) => ({
                ...prev,
                addressInfoData: { ...prev.addressInfoData, [name]: value },
            }));
        };

        const handleValidation = () => {
            if (!CustomerData.customerDraftReadOnlyFlag) {
                if (validator.allValid()) {
                    ref.current.isValidated = true;
                } else {
                    validator.showMessages();
                    ref.current.isValidated = false;
                    forceUpdate({});
                }
            }
        };

        const [, forceUpdate] = useState({});

        // Expose the childFunction to the parent component using useImperativeHandle

        useImperativeHandle(ref, () => ({
            handleValidation,
            isValidated,
        }));

        return (
            <div>
                {contextHolder}
                <div className={styles["basic-info-container"]}>
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Address Type"}
                                onChange={(e) =>
                                    handleSelector(e, "addressTypeId")
                                }
                                optionsList={picklistData.addressTypeList}
                                value={
                                    CustomerData.addressInfoData.addressTypeId
                                }
                                name={"AddressType"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "AddressType",
                                    CustomerData.addressInfoData.addressTypeId,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"House No / Building Name "}
                                type={"text"}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressLine1
                                }
                                name='primaryAddressLine1'
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "primaryAddressLine1",
                                    CustomerData.addressInfoData
                                        .primaryAddressLine1,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"Street"}
                                type={"text"}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressLine2
                                }
                                name='primaryAddressLine2'
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"Town/District"}
                                type={"text"}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressLine3
                                }
                                name='primaryAddressLine3'
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label={"Directions"}
                                type={"text"}
                                onChange={handleAddressInfo}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressLine4
                                }
                                name='primaryAddressLine4'
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Country"}
                                onChange={(e) => {
                                    handleSelector(
                                        e,
                                        "primaryAddressCountryCd"
                                    );
                                    setCustomerData((prev) => ({
                                        ...prev,
                                        addressInfoData: {
                                            ...prev.addressInfoData,
                                            primaryAddressState: "",
                                        },
                                    }));
                                }}
                                optionsList={picklistData.countryList}
                                value={CustomerData.addressInfoData.primaryAddressCountryCd?.toString()}
                                name={"country"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "country",
                                    CustomerData.addressInfoData
                                        .primaryAddressCountryCd,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"State"}
                                onChange={(e) => {
                                    handleSelector(e, "primaryAddressState");
                                    setCustomerData((prev) => ({
                                        ...prev,
                                        addressInfoData: {
                                            ...prev.addressInfoData,
                                            primaryAddressCity: "",
                                        },
                                    }));
                                }}
                                optionsList={states}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressState
                                }
                                name={"state"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "state",
                                    CustomerData.addressInfoData
                                        .primaryAddressState,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"City"}
                                onChange={(e) =>
                                    handleSelector(e, "primaryAddressCity")
                                }
                                optionsList={cites}
                                value={
                                    CustomerData.addressInfoData
                                        .primaryAddressCity
                                }
                                name={"city"}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "city",
                                    CustomerData.addressInfoData
                                        .primaryAddressCity,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomDatePicker
                                value={CustomerData.addressInfoData.strFromDate}
                                label='Residing Since'
                                onChange={(date: any, dateString: any) => {
                                    setCustomerData((prev) => ({
                                        ...prev,
                                        addressInfoData: {
                                            ...prev.addressInfoData,
                                            strFromDate: dateString,
                                        },
                                    }));
                                }}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                                name={"Fromdate"}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "Fromdate",
                                    CustomerData.addressInfoData.strFromDate,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default AddressInfo;
