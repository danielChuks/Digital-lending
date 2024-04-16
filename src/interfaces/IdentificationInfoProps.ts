export interface identificationInfoProps {
    binaryImage: string;
    countryOfIssueId: string | null;
    identityNumber: string;
    identityTypeCd?: string;
    identityTypeDesc?: string;
    strExpiryDate?: string;
    strIssueDate?: string;
    verifiedFlag?: boolean;
}
