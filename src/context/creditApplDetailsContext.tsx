import {
    useState,
    createContext,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';
import { ApplCreditData } from '../interfaces/ApplCreditData.interface';

interface MyComponentProps {
    children: ReactNode;
}

//Define the shape of your context state
interface MyContextType {
    creditApplDataFields_context: ApplCreditData;
    setCreditApplDataFields_context: Dispatch<SetStateAction<ApplCreditData>>;
}

export const CreditApplicationData = createContext<MyContextType | null>(null);

//Define a custom hook to access the context
export function useCreditApplicationDataContext() {
    const context = useContext(CreditApplicationData);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
}




const CreditApplContext = ({ children }: MyComponentProps) => {
    const [creditApplDataFields_context, setCreditApplDataFields_context] =
        useState<ApplCreditData>({
            basicInfo: {
                amount: null,
                creditTypeId: null,
                currencyId: null,
                productId: null,
                purposeOfCreditId: null,
                strApplicationDate: '',
                termCode: '',
                termValue: null,
                repaySourceAcctNo: '',
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
