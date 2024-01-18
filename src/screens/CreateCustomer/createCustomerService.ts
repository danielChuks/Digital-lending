import { PostAxios } from '../../Network/api';
import { useMutation } from 'react-query';

///// Get the pickList Data /////////

const getPicklist = async (
    credentials: any = {
        instituteCode: sessionStorage.getItem('instituteCode'),
        transmissionTime: Date.now(),
        groupCode: 'CUSTOMER',
    }
): Promise<any> => {
    const responsePicklist = await PostAxios(
        '/app/dbs/userservice/getPickListData',
        credentials
    );
    return responsePicklist;
};

const picklistMutationFn = (credentials: any) => {
    return getPicklist(credentials);
};

export const useGetPicklist = () => useMutation(picklistMutationFn);

///// create Customer Draft /////////

const CreateCustomerDraft = async (credentials: any): Promise<any> => {
    const responseCreateCustomerDraft = await PostAxios(
        '/app/dbs/customerapplication/createCustomerApplDraft',
        credentials
    );
    return responseCreateCustomerDraft;
};

const createCustomerDraftMutationFn = (credentials: any) => {
    return CreateCustomerDraft(credentials);
};

export const useCreateCustomerDraft = () =>
    useMutation(createCustomerDraftMutationFn);

///// create Customer /////////

const CreateDBSCustomer = async (credentials: any): Promise<any> => {
    const responseCreateCustomerDraft = await PostAxios(
        '/app/dbs/customerapplication/createCustomerForDBSUser',
        credentials
    );
    return responseCreateCustomerDraft;
};

const createDBSCustomerMutationFn = (credentials: any) => {
    return CreateDBSCustomer(credentials);
};

export const useCreateDBSCustomer = () =>
    useMutation(createDBSCustomerMutationFn);

///// create Document for Customer /////////

const CreateCustomerDocument = async (credentials: any): Promise<any> => {
    const responseCreateCustomerDocument = await PostAxios(
        'app/dbs/document/createDocument',
        credentials
    );
    return responseCreateCustomerDocument;
};

const createCustomerDocumentMutationFn = (credentials: any) => {
    return CreateCustomerDocument(credentials);
};

export const useCreateCustomerDocument = () =>
    useMutation(createCustomerDocumentMutationFn);

///// modify Document for Customer /////////

const ModifyCustomerDocument = async (credentials: any): Promise<any> => {
    const responseModifyCustomerDocument = await PostAxios(
        '/app/dbs/document/modifyDocument',
        credentials
    );
    return responseModifyCustomerDocument;
};

const modifyCustomerDocumentMutationFn = (credentials: any) => {
    return ModifyCustomerDocument(credentials);
};

export const useModifyCustomerDocument = () =>
    useMutation(modifyCustomerDocumentMutationFn);

///// remove Document for Customer /////////

const RemoveCustomerDocument = async (credentials: any): Promise<any> => {
    const responseRemoveCustomerDocument = await PostAxios(
        '/app/dbs/document/removeDocument',
        credentials
    );
    return responseRemoveCustomerDocument;
};

const removeCustomerDocumentMutationFn = (credentials: any) => {
    return RemoveCustomerDocument(credentials);
};

export const useRemoveCustomerDocument = () =>
    useMutation(removeCustomerDocumentMutationFn);
