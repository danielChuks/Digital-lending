import { AxiosResponse } from "axios";
import axiosInstance, { PostAxios } from "../../../Network/api";
import { useMutation } from "react-query";
import { UserDetailRequest } from "../../OtpVerification/otp";

export interface Account {
    acctNo: string;
    acctName: string;
    status: string;
    productCategory: string;
    productDesc: number;
    clearedBalance: string;
    stmtData: string;
    availableBalance: string;
}

export interface LoanAccount {
    disbAmount: string;
    acctNo: string;
    acctName: string;
    rateOfInterest: string;
    outstandingAmount: string;
    loanType: string;
    tenure: string;
    status: string;
    productCategory: string;
    productDesc: number;
    emi: string;
    stmtData: string;
    availableBalance: string;
}

export interface AccountResponse {
    errorMsg: string;
    objectId: string;
    referenceNo: string;
    dpAcctDetails: Account[];
    returnCd: string;
    lnAcctDetails: LoanAccount[];
}

export interface AccountStatementRequest {
    instituteCode: string;
    transmissionTime: number;
    acctNo: string;
    productCateory: string;
}

export interface AccountStatementResponse {
    errorMsg: string;
    returnCd: string;
    stmtData: Statement[];
}

export interface Statement {
    drcr: string;
    refNo: string;
    tranDesc: string;
    txnAmt: string;
    txnDate: string;
}

export interface RepaymentScheduleRequest {
    acctNo: number;
    channelCode: string;
    channelId: string;
    instituteCode: string;
    transmissionTime: number;
}

const accountList = async (
    requestdata: UserDetailRequest
): Promise<AccountResponse> => {
    const accountDetailsResponse = await PostAxios(
        "/app/dbs/account/findCustomerAccDetails",
        requestdata
    );
    return accountDetailsResponse;
};

const accountListMutationFN = (requestdata: UserDetailRequest) => {
    return accountList(requestdata);
};

export const useAccountList = () => useMutation(accountListMutationFN);

const accountStatementList = async (
    requestdata: AccountStatementRequest
): Promise<AccountStatementResponse> => {
    const customerAccStatementResponse = await PostAxios(
        "/app/dbs/account/findCustomerAccStatement",
        requestdata
    );
    return customerAccStatementResponse;
};

const accountStatementListMutationFN = (
    requestdata: AccountStatementRequest
) => {
    return accountStatementList(requestdata);
};

export const useStatementAccountList = () =>
    useMutation(accountStatementListMutationFN);

//  Repayment schedule section..................
const repaymentSchedule = async (
    requestdata: RepaymentScheduleRequest
): Promise<any> => {
    const response = await PostAxios(
        "app/dbs/account/findCustomerAccRepaymentSchedule",
        requestdata
    );

    return response;
};

const repaymentScheduleMutationFunction = (
    requestdata: RepaymentScheduleRequest
) => {
    return repaymentSchedule(requestdata);
};

export const useRepaymentSchedule = () =>
    useMutation(repaymentScheduleMutationFunction);
