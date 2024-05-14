import {
    useState,
    createContext,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { CustomerDataType } from "../interfaces";

const basicInfo = {
    email: "",
    mobile: "",
    strDateOfBirth: "",
    nextOfKin: "",
    spouseName: "",
    titleCd: null,
    lastName: "",
    middleName: "",
    firstName: "",
    customerType: "",
    nationalityCd: "532",
    industryId: "",
    countryOfResidenceId: "",
    maritalStatus: "",

    countryOfBirthId: "",
    gender: "",
    occupationCd: "",
    employmentFlag: false,
    noOfDependents: "",

    organisationName: "",
    registrationNumber: "",
    strRegistrationDate: "",
};

const addressInfo = {
    primaryAddressCountryCd: "682",
    primaryAddressCity: "",
    primaryAddressLine1: "",
    primaryAddressLine2: "",
    primaryAddressLine3: "",
    primaryAddressLine4: "",
    primaryAddressState: "",
    strFromDate: "",

    addressTypeId: "",
};

const otherInfo = {
    openingReasonCd: "",
    marketingCampaignCd: "",
    sourceOfFundCd: "",
    amountUnit: "",
    monthlyIncomeAmount: 0,
};

// Define props for MyContextProvider
interface ChildrenProps {
    children: ReactNode;
}

// Define the shape of your context state
interface CustomerContextType {
    CustomerData: CustomerDataType;
    setCustomerData: Dispatch<SetStateAction<CustomerDataType>>;
}

export const CustomerContextData = createContext<CustomerContextType | null>(
    null
);

// Define a custom hook to access the context
export function useCustomerContext() {
    const context = useContext(CustomerContextData);
    if (!context) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
}

export const CustomerDetailsContext: React.FC<ChildrenProps> = ({
    children,
}) => {
    const [CustomerData, setCustomerData] = useState<CustomerDataType>({
        basicInfoData: basicInfo,
        addressInfoData: addressInfo,
        otherInfoData: otherInfo,
        customerCategory: "",
        identificationInfoData: null,
        documentInfodata: null,
        strphotoGraphImage: null,
        strsignatureImage: null,
        addDocumentFlag: false,
        customerDraftFlag: false,
        customerDraftReadOnlyFlag: false,
        loading: false,
    });

    const contextValue: CustomerContextType = {
        CustomerData,
        setCustomerData,
    };

    return (
        <CustomerContextData.Provider value={contextValue}>
            {children}
        </CustomerContextData.Provider>
    );
};
