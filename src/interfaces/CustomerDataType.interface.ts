import { addressInfoProps } from "./AddressInfoProps.interface";
import { basicInfoProps } from "./BasicInfoProps.interface";
import { identificationInfoProps } from "./IdentificationInfoProps";
import { otherInfoProps } from "./OtherInfoProps.interface";

export interface CustomerDataType {
    basicInfoData: basicInfoProps;
    addressInfoData: addressInfoProps;
    otherInfoData: otherInfoProps;
    customerCategory?: string | null;
    identificationInfoData?: identificationInfoProps[] | null | undefined | any;
    documentInfodata?: any[] | null;
    strphotoGraphImage?: string | null;
    strsignatureImage?: string | null;
    addDocumentFlag?: boolean;
    customerDraftFlag: boolean;
    customerDraftReadOnlyFlag: boolean;
    loading: boolean;
}
