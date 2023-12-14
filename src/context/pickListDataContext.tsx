import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";


/**after the space add picklist data for create credit apllication */
export interface pickListType {
  titleList: any;
  countryList: any;
  nationalityList: any;
  industryList: any;
  maritalStatusList: any;
  genderList: any;
  occupationList: any;
  addressTypeList:any;
  currencyList: any;
  sourceofFundList: any;
  marketingCampaignList: any;
  openingReasonList: any;
  customerTypeList:any;
  
  //pick list data for credit application
  collateralTypeLendingList:any;
  collatteralTypeRefList:any;
  creditDocumentRefList:any;
  creditOfficerList:any;
  creditPortfolioList:any;
  creditTypeList:any;
  creditUlitisationTypeList:any;
  productCreditTypeList:any;
  productCustomerAndCreditTypeList:any;
  purposeOfCreditTypeList:any;
  termCode:any
  
  
}

// Define props for MyContextProvider
interface ChildrenProps {
  children: ReactNode;
}

// Define the shape of your context state
interface pickListContextType {
  picklistData: pickListType;
  setPicklistData: Dispatch<SetStateAction<pickListType>>;
}

export const pickListContext = createContext<pickListContextType | null>(null);

// Define a custom hook to access the context
export function usePickListContext() {
  const context = useContext(pickListContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}

export const PickListContext: React.FC<ChildrenProps> = ({ children }) => {
  const [picklistData, setPicklistData] = useState<pickListType>({
    titleList: [],
    countryList: [],
    nationalityList: [],
    industryList: [],
    maritalStatusList: [],
    genderList: [],
    occupationList: [],
    addressTypeList: [],
    currencyList: [],
    sourceofFundList: [],
    marketingCampaignList: [],
    openingReasonList: [],
    customerTypeList:[],

    //picklist for acredit app

    collateralTypeLendingList: [],
    collatteralTypeRefList:[],
    creditDocumentRefList:[],
    creditOfficerList:[],
    creditPortfolioList:[],
    creditTypeList:[],
    creditUlitisationTypeList:[],
    productCreditTypeList:[],
    productCustomerAndCreditTypeList:[],
    purposeOfCreditTypeList:[],
    termCode:[],


  });

  const contextValue: pickListContextType = {
    picklistData,
    setPicklistData,
  };

  return (
    <pickListContext.Provider value={contextValue}>
      {children}
    </pickListContext.Provider>
  );
};
