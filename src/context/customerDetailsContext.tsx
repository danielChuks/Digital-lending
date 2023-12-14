import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface basicInfoProps {
  email: string | any;
  mobile: string | any;
  strDateOfBirth: string;
  nextOfKin: string;
  spouseName: string;
  titleCd: string | null;
  lastName: string;
  middleName: string;
  firstName: string;
  customerType: string;
  nationalityCd: string | null;
  industryId: string;
  countryOfResidenceId: string;
  maritalStatus: string;
  countryOfBirthId: string;
  gender: string;
  occupationCd: string;
  organisationName: string;
  registrationNumber: string;
  strRegistrationDate: string;
  employmentFlag:boolean;
  noOfDependents:string
}

interface addressInfoProps {
  primaryAddressCity?: string;
  primaryAddressLine1?: string;
  primaryAddressLine2?: string;
  primaryAddressLine3?: string;
  primaryAddressLine4?: string;
  primaryAddressState?: string;
  strFromDate: string;
  primaryAddressCountryCd?: string;
  addressTypeId?: string;
}

interface otherInfoProps {
  openingReasonCd: string;
  marketingCampaignCd: string;
  sourceOfFundCd: string;
  amountUnit: string;
  monthlyIncomeAmount: string;
}

export interface identificationInfoProps {
  binaryImage: string;
  countryOfIssueId: number | null ;
  identityNumber: string;
  identityTypeCd?: string;
  identityTypeDesc?: string;
  strExpiryDate?: string;
  strIssueDate?: string;
}

export interface DocumentListInfoProps {
  binaryDocument?: string | Blob | any;
  docFileExt?: string | Blob | any;
  docFileName?: string | any;
  docTypeDesc?: string | any;
  docExt?: string | any;
  docId?: number | null | any;
  docRef?: string | any;
  docTypeId?: number | null | any;
  docDesc?: string | any;
}

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
  nationalityCd: null,
  industryId: "",
  countryOfResidenceId: "",
  maritalStatus: "",

  countryOfBirthId: "",
  gender: "",
  occupationCd: "",
  employmentFlag:false,
  noOfDependents:"",

  organisationName: "",
  registrationNumber: "",
  strRegistrationDate: "",
};

const addressInfo = {
  primaryAddressCity: "",
  primaryAddressLine1: "",
  primaryAddressLine2: "",
  primaryAddressLine3: "",
  primaryAddressLine4: "",
  primaryAddressState: "",
  strFromDate: "",
  primaryAddressCountryCd: "",
  addressTypeId: ""
};

const otherInfo = {
  openingReasonCd: "",
  marketingCampaignCd: "",
  sourceOfFundCd: "",
  amountUnit: "",
  monthlyIncomeAmount: ""
};

const identificationInfo =  {
  binaryImage: "",
  countryOfIssueId: null,
  identityNumber: "",
  identityTypeId: "",
  identityTypeDesc: "",
  strExpiryDate: "",
  strIssueDate: ""
}

const documentInfo = {
  binaryDocument: "",
  docFileExtension: "",
  docFileName: "",
  documentDescription: "",
  documentExtension: "",
  documentExtensionDescription: "",
  documentId: null,
  documentRefernce: "",
  documentType: null,
  documentTypeDescription: "",
}

export interface CustomerDataType {
  basicInfoData: basicInfoProps ;
  addressInfoData: addressInfoProps;
  otherInfoData: otherInfoProps;
  customerCategory?: string | null;
  identificationInfoData?:identificationInfoProps[] | null | undefined | any ,
  documentInfodata?:any[] | null;
  strphotoGraphImage?:string | null,
  strsignatureImage?:string | null,
  addDocumentFlag?:boolean,
  customerDraftFlag:boolean,
  customerDraftReadOnlyFlag:boolean,
  loading:boolean
}

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
    identificationInfoData:null,
    documentInfodata:null,
    strphotoGraphImage:null,
    strsignatureImage:null,
    addDocumentFlag:false,
    customerDraftFlag:false,
    customerDraftReadOnlyFlag:false,
    loading:false,
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
