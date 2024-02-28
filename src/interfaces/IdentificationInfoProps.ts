export interface identificationInfoProps {
    binaryImage: string;
    countryOfIssueId: number | null;
    identityNumber: string;
    identityTypeCd?: string;
    identityTypeDesc?: string;
    strExpiryDate?: string;
    strIssueDate?: string;
    verifiedFlag?: boolean;
}
