import { BasicInfo } from "./BasicInfo.interface";

export interface ApplCreditData {
    basicInfo?: BasicInfo;
    collateralinfoData?: any[] | null;
    documentInfodata?: any[] | null;
    addDocumentFlag?: boolean;
    loading: boolean;
}