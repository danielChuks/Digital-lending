import { useMutation } from "react-query";
import { PostAxios } from "../../../Network/api";

export interface IFindAppDraftResponse {
  errorMsg: any;
  objectId: any;
  referenceNo: any;
  dbsUserId: number;
  returnCd: string;
  responseMsg: any;
  applData: ApplDaum[];
}

export interface ApplDaum {
  errorMsg?: any;
  objectId?: any;
  referenceNo?: any;
  dbsUserId?: any;
  dbsCustApplId?: number;
  applRefNo?: string;
  customerId?: any;
  creditApplId?: any;
  creditApplStatus?: any;
  applType?: string;
  applData?: any;
  custDraftData?: any;
  creditAppDraftData?: any;
  depositAccDraftData?: any;
  recordavailablestatus?: boolean;
  returnCd?: any;
  responseMsg?: any;
}


async function findAppDraft(credentials: any): Promise<IFindAppDraftResponse> {
  const applDraftResponse = await PostAxios(
    "/app/dbs/creditapplication/findApplDraft",
    credentials
  );
  return applDraftResponse;
}

const findAppDraftMutationFN = (requestdata: any) => {
  return findAppDraft(requestdata);
};

export const useFindAppDraft = () => useMutation(findAppDraftMutationFN);

async function removeAppDraft(
  credentials: any
): Promise<IFindAppDraftResponse> {
  const applDraftResponse = await PostAxios(
    "/app/dbs/customerapplication/removeCustomerApplDraft",
    credentials
  );
  return applDraftResponse;
}

const removeAppDraftMutationFN = (requestdata: any) => {
  return removeAppDraft(requestdata);
};

export const useRemoveAppDraft = () => useMutation(removeAppDraftMutationFN);

async function trackDBSCustomer(
  credentials: any
): Promise<IFindAppDraftResponse> {
  const applDraftResponse = await PostAxios(
    "/app/dbs/customerapplication/trackDBSCustomer",
    credentials
  );
  return applDraftResponse;
}

const trackDBSCustomerMutationFN = (requestdata: any) => {
  return trackDBSCustomer(requestdata);
};

export const useTrackDBSCustomer = () =>
  useMutation(trackDBSCustomerMutationFN);


