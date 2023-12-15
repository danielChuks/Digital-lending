export interface User {
    dbsUserId: number;
    userName: string | null;
    emlVerifyFlag: boolean | null;
    mobileVerifyFlag: boolean | null;
    email: string;
    mobile: string;
    returnCd: string;
    userProfileImage: string | null;
    linkedCustFlag: boolean;
    custNo: string | null;

    errorMsg: any;
    objectId: any;
    referenceNo: any;
    birthDate: string;
    customerNumber: any;
    customerId: any;
    firstName: string;
    lastName: string;

    accessToken: any;
    refreshToken: any;
}
