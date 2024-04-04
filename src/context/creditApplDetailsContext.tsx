import {
    useState,
    createContext,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

export interface ApplCreditData {
    basicInfo?: BasicInfo;
    collateralinfoData?: any[] | null;
    documentInfodata?: any[] | null;
    addDocumentFlag?: boolean;
    loading: boolean;
}

export interface CreditCollateralDocument {
    collateralDescription: string | any;
    collateralMarketValue: number | null | any;
    collateralRefNo: number | null | any;
    collateralTypeDescription: string | any;
    collateralTypeId: number | null | any;
    expiryDateStr: string | any;
    forcedSalesValue: number | null | any;
    collateralCurrencyId: number | null;
    lendingPercent: number | null | any;
    lendingValue: number | null | any;
}

export interface CreditDocument {
    docFileExtension: string;
    docFileName: string;
    documentDescription: string;
    documentId: number | null | any;
    documentRefernce: string;
    documentType: number | null;
    documentTypeDescription: string;
}

export interface BasicInfo {
    amount?: string;
    creditTypeId?: number | null;
    currencyId?: number | any;
    productId?: number | any;
    purposeOfCreditId?: number | null;
    strApplicationDate?: string;
    termCode?: string;
    termValue?: number | null;
    repaySourceAcctNo?: string;
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

interface MyComponentProps {
    children: ReactNode;
}

// Define the shape of your context state
interface MyContextType {
    creditApplDataFields_context: ApplCreditData;
    setCreditApplDataFields_context: Dispatch<SetStateAction<ApplCreditData>>;
}

export const CreditApplicationData = createContext<MyContextType | null>(null);

// Define a custom hook to access the context
export function useCreditApplicationDataContext() {
    const context = useContext(CreditApplicationData);
    if (!context) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
}
const CreditApplContext: React.FC<MyComponentProps> = ({ children }) => {
    const [creditApplDataFields_context, setCreditApplDataFields_context] =
        useState<ApplCreditData>({
            basicInfo: {
                amount: '',
                creditTypeId: null,
                currencyId: null,
                productId: null,
                purposeOfCreditId: null,
                strApplicationDate: "",
                termCode: "",
                termValue: null,
                repaySourceAcctNo: "",
            },
            collateralinfoData: null,
            documentInfodata: null,
            addDocumentFlag: false,
            loading: false,
        });

    const contextValue: MyContextType = {
        creditApplDataFields_context,
        setCreditApplDataFields_context,
    };

    return (
        <CreditApplicationData.Provider value={contextValue}>
            {children}
        </CreditApplicationData.Provider>
    );
};

export default CreditApplContext;
