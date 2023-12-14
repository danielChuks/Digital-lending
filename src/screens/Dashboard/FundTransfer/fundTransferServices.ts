import { useMutation } from "react-query";
import { PostAxios } from "../../../Network/api";

async function getBankList(credentials: any): Promise<any> {
  const applDraftResponse = await PostAxios(
    "/app/palms/getNipBanks",
    credentials
  );
  return applDraftResponse;
}

const getBankListMutationFN = (requestdata: any) => {
  return getBankList(requestdata);
};

export const useGetBankList = () => useMutation(getBankListMutationFN);

async function getBeneficiaryName(credentials: any): Promise<any> {
  const applDraftResponse = await PostAxios(
    `/app/palms/${credentials.url}`,
    credentials.payLoad
  );
  return applDraftResponse;
}

const getBeneficiaryNameMutationFN = (requestdata: any) => {
  return getBeneficiaryName(requestdata);
};

export const useGetBeneficiaryName = () =>
  useMutation(getBeneficiaryNameMutationFN);

async function fundTransfer(credentials: any): Promise<any> {
  const applDraftResponse = await PostAxios(
    "/app/dbs/xfer/fundTransfer",
    credentials
  );
  return applDraftResponse;
}

const fundTransferMutationFN = (requestdata: any) => {
  return fundTransfer(requestdata);
};

export const useFundTransfer = () => useMutation(fundTransferMutationFN);

async function getMessages(credentials: any): Promise<any> {
  const applDraftResponse = await PostAxios(
    "/app/dbs/userservice/getCustomerAlerts",
    credentials
  );
  return applDraftResponse;
}

const getMessagesMutationFN = (requestdata: any) => {
  return getMessages(requestdata);
};

export const useGetMessages = () => useMutation(getMessagesMutationFN);
