import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import styles from "../createCustomer.module.css";
import InputField from "../../../components/InputFiled/InputField";
import CustomSelector from "../../../components/CustomSelector/customSelector";
import type { RadioChangeEvent } from "antd";
import { useCustomerContext } from "../../../context/customerDetailsContext";
import CustomDatePicker from "../../../components/CustomDatePicker/customDatePicker";
import CustomRadioInput from "../../../components/CustomRadioInput/customRadioInput";
import { usePickListContext } from "../../../context/pickListDataContext";
import SimpleReactValidator from "simple-react-validator";

// Define the props for the ChildComponent
type ChildComponentProps = {};

// Define the methods that will be exposed via the ref
interface ChildMethods {
    handleValidation: () => void;
}

const BasicInfo = forwardRef<ChildMethods, ChildComponentProps>(
    (props, ref: any) => {
        // const validator = new SimpleReactValidator();
        const [validator] = useState(new SimpleReactValidator());
        const { CustomerData, setCustomerData } = useCustomerContext();
        const [isIndividual, setIsIndividual] = useState(true);

        const { picklistData } = usePickListContext();
        const isValidated = false;

        useEffect(() => {
            const cat = "PER";
            CustomerData.customerCategory === cat
                ? setIsIndividual(true)
                : setIsIndividual(false);
        }, [CustomerData.customerCategory]);

        const handleRadioChange = (e: RadioChangeEvent) => {
            setCustomerData((prev) => ({
                ...prev,
                basicInfoData: {
                    ...prev.basicInfoData,
                    employmentFlag: e.target.value,
                },
            }));
        };

        const handleBasicInfo = ({
            target: { value, name },
        }: React.ChangeEvent<HTMLInputElement>) => {
            setCustomerData((prev) => ({
                ...prev,
                basicInfoData: { ...prev.basicInfoData, [name]: value },
            }));
        };

        const handleSelector = (
            value: React.MouseEvent<Element, MouseEvent>,
            name: string
        ) => {
            setCustomerData((prev) => ({
                ...prev,
                basicInfoData: { ...prev.basicInfoData, [name]: value },
            }));
        };

        const handleValidation = () => {
            if (isIndividual) {
                validator.fields.organisationName = true;
            } else {
                validator.fields.firstName = true;
                validator.fields.countryOfBirthId = true;
                validator.fields.lastName = true;
                validator.fields.maritalStatus = true;
                validator.fields.noOfDependents = true;
                validator.fields.titleCd = true;
                validator.fields.gender = true;
            }

            if (validator.allValid()) {
                ref.current.isValidated = true;
            } else {
                validator.showMessages();
                ref.current.isValidated = false;
                forceUpdate({});
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
                <div className={styles["basic-info-container"]}>
                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label='Email'
                                placeholder={"Email"}
                                type={"text"}
                                onChange={handleBasicInfo}
                                name={"email"}
                                value={CustomerData.basicInfoData.email}
                                readonly={true}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "email",
                                    CustomerData.basicInfoData.email,
                                    "required|email"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div className={styles["input-container"]}>
                            <InputField
                                label='Mobile Number'
                                placeholder={"Mobile Number"}
                                type={"text"}
                                onChange={handleBasicInfo}
                                value={CustomerData.basicInfoData.mobile}
                                name={"mobile"}
                                readonly={true}
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "mobile",
                                    CustomerData.basicInfoData.mobile,
                                    "required|phone"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label='Customer Type'
                                onChange={(e) =>
                                    handleSelector(e, "customerType")
                                }
                                optionsList={picklistData.customerTypeList}
                                name='customerType'
                                value={CustomerData.basicInfoData.customerType?.toString()}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "customerType",
                                    CustomerData.basicInfoData.customerType,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    {isIndividual ? (
                        <>
                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomSelector
                                        label='Title'
                                        onChange={(e) =>
                                            handleSelector(e, "titleCd")
                                        }
                                        optionsList={picklistData.titleList}
                                        name='titleCd'
                                        value={
                                            CustomerData.basicInfoData.titleCd
                                        }
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "titleCd",
                                            CustomerData.basicInfoData.titleCd,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='First Name'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData.firstName
                                        }
                                        name='firstName'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "firstName",
                                            CustomerData.basicInfoData
                                                .firstName,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Middle Name'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData
                                                .middleName
                                        }
                                        name='middleName'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>
                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Last Name'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData.lastName
                                        }
                                        name='lastName'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "lastName",
                                            CustomerData.basicInfoData.lastName,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                    {!isIndividual ? (
                        <>
                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Organisation Name'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData
                                                .organisationName
                                        }
                                        name='organisationName'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {!isIndividual
                                            ? validator.message(
                                                  "organisationName",
                                                  CustomerData.basicInfoData
                                                      .organisationName,
                                                  "required"
                                              )
                                            : ""}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Registration Number'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData
                                                .registrationNumber
                                        }
                                        name='registrationNumber'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <CustomDatePicker
                                        value={
                                            CustomerData.basicInfoData
                                                .strRegistrationDate
                                        }
                                        label={"Registration Date"}
                                        onChange={(
                                            date: any,
                                            dateString: any
                                        ) => {
                                            setCustomerData((prev) => ({
                                                ...prev,
                                                basicInfoData: {
                                                    ...prev.basicInfoData,
                                                    strRegistrationDate:
                                                        dateString,
                                                },
                                            }));
                                        }}
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        ""
                    )}

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Nationality"}
                                onChange={(e) =>
                                    handleSelector(e, "nationalityCd")
                                }
                                optionsList={picklistData.nationalityList}
                                name='nationalityCd'
                                value={CustomerData.basicInfoData.nationalityCd}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "nationalityCd",
                                    CustomerData.basicInfoData.nationalityCd,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Industry"}
                                onChange={(e) =>
                                    handleSelector(e, "industryId")
                                }
                                optionsList={picklistData.industryList}
                                name='industryId'
                                value={CustomerData.basicInfoData.industryId?.toString()}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "industryId",
                                    CustomerData.basicInfoData.industryId,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomSelector
                                label={"Country of Residence"}
                                onChange={(e) =>
                                    handleSelector(e, "countryOfResidenceId")
                                }
                                optionsList={picklistData.countryList}
                                name='countryOfResidenceId'
                                value={CustomerData.basicInfoData.countryOfResidenceId?.toString()}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                            <span className='text-error'>
                                {validator.message(
                                    "countryOfResidenceId",
                                    CustomerData.basicInfoData
                                        .countryOfResidenceId,
                                    "required"
                                )}
                            </span>
                        </div>
                    </div>

                    {isIndividual ? (
                        <>
                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomSelector
                                        label={"Marital status"}
                                        onChange={(e) =>
                                            handleSelector(e, "maritalStatus")
                                        }
                                        optionsList={
                                            picklistData.maritalStatusList
                                        }
                                        name='maritalStatus'
                                        value={
                                            CustomerData.basicInfoData
                                                .maritalStatus
                                        }
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "maritalStatus",
                                            CustomerData.basicInfoData
                                                .maritalStatus,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Spouse Name'
                                        type={"text"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData
                                                .spouseName
                                        }
                                        name='spouseName'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Next of kin'
                                        type={"number"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData.nextOfKin
                                        }
                                        name='nextOfKin'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div className={styles["input-container"]}>
                                    <InputField
                                        label='Number of Dependent'
                                        type={"number"}
                                        onChange={handleBasicInfo}
                                        value={
                                            CustomerData.basicInfoData
                                                .noOfDependents
                                        }
                                        name='noOfDependents'
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomDatePicker
                                        value={
                                            CustomerData.basicInfoData
                                                .strDateOfBirth
                                        }
                                        label='Date of Birth'
                                        onChange={(
                                            date: any,
                                            dateString: any
                                        ) => {
                                            setCustomerData((prev) => ({
                                                ...prev,
                                                basicInfoData: {
                                                    ...prev.basicInfoData,
                                                    strDateOfBirth: dateString,
                                                },
                                            }));
                                        }}
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "noOfDependents",
                                            CustomerData.basicInfoData
                                                .strDateOfBirth,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomSelector
                                        label={"Country of Birth"}
                                        onChange={(e) =>
                                            handleSelector(
                                                e,
                                                "countryOfBirthId"
                                            )
                                        }
                                        optionsList={picklistData.countryList}
                                        name='countryOfBirthId'
                                        value={CustomerData.basicInfoData.countryOfBirthId?.toString()}
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "countryOfBirthId",
                                            CustomerData.basicInfoData
                                                .countryOfBirthId,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomSelector
                                        label={"Gender"}
                                        onChange={(e) =>
                                            handleSelector(e, "gender")
                                        }
                                        optionsList={picklistData.genderList}
                                        name='gender'
                                        value={CustomerData.basicInfoData.gender?.toString()}
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                    <span className='text-error'>
                                        {validator.message(
                                            "gender",
                                            CustomerData.basicInfoData.gender,
                                            "required"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className={styles["input-container-split"]}>
                                <div>
                                    <CustomSelector
                                        label={"Ocupation"}
                                        onChange={(e) =>
                                            handleSelector(e, "occupationCd")
                                        }
                                        optionsList={
                                            picklistData.occupationList
                                        }
                                        name='occupationCd'
                                        value={
                                            CustomerData.basicInfoData
                                                .occupationCd
                                        }
                                        readonly={
                                            CustomerData.customerDraftReadOnlyFlag
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>
                {isIndividual ? (
                    <div className={styles["input-container-split"]}>
                        <div>
                            <CustomRadioInput
                                title='Employed'
                                onChange={handleRadioChange}
                                value={
                                    CustomerData.basicInfoData.employmentFlag
                                }
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                                readonly={
                                    CustomerData.customerDraftReadOnlyFlag
                                }
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
);

export default BasicInfo;
