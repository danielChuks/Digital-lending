import axiosInstance, { fetchConfigInfo, PostAxios } from "../../Network/api";
import { useMutation } from "react-query";
import axios, { Axios } from "axios";

///// Get the pickList Data /////////

const getPicklist = async (credentials: any = {
        instituteCode: sessionStorage.getItem("instituteCode"),
        transmissionTime: Date.now(),
        groupCode: "CUSTOMER",
    }
): Promise<any> => {
    const responsePicklist = await PostAxios(
        "/app/dbs/userservice/getPickListData",
        credentials
    );
    return responsePicklist;
};

const picklistMutationFn = (credentials: any) => {
    return getPicklist(credentials);
};

export const useGetPicklist = () => useMutation(picklistMutationFn);

///// create Customer Draft /////////
const CreateCreditApplDraft = async (credentials: any): Promise<any> => {
    const responseCreateCreditApplDraft = await PostAxios(
        // "/app/dbs/customerapplication/createCustomerApplDraft",

        "/app/dbs/creditapplication/createCreditApplDraft",
        credentials
    );
    return responseCreateCreditApplDraft;
};
const createCreditApplDraftMutationFn = (credentials: any) => {
    return CreateCreditApplDraft(credentials);
};
export const useCreateCreditApplDraft = () =>
    useMutation(createCreditApplDraftMutationFn);
///// create Credit Application /////////

const CreateDBSCreditAppl = async (credentials: any): Promise<any> => {
    const responseCreateCreditApplDraft = await PostAxios(
        "/app/dbs/creditapplication/createCreditApplication",

        credentials
    );
    return responseCreateCreditApplDraft;
};

const createDBSCreditApplMutationFn = (credentials: any) => {
    return CreateDBSCreditAppl(credentials);
};

export const useCreateDBSCreditAppl = () =>
    useMutation(createDBSCreditApplMutationFn);
