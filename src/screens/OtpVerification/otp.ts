import { PostAxios } from "../../Network/api";
import { useMutation } from "react-query";
import { User } from "../Signin/signin";

export interface UserDetailRequest {
  instituteCode: string;
  transmissionTime: number;
  dbsUserId: string;
}
export interface ValidateOTP {
  instituteCode: string;
  transmissionTime: number;
  dbsUserId: string;
  securityCd: string;
}

const requestOTP = async (requestdata: UserDetailRequest): Promise<User> => {
  const generateotpResponse = await PostAxios(
    "/app/dbs/userservice/generateOtp",
    requestdata
  );
  return generateotpResponse;
};

const requestOTPMutationFN = (requestdata: UserDetailRequest) => {
  return requestOTP(requestdata);
};

export const useRequestOTP = () => useMutation(requestOTPMutationFN);


const validateOTP = async (requestdata: ValidateOTP): Promise<User> => {
  const validateotpResponse = await PostAxios(
    "/app/dbs/userservice/otpValidation",
    requestdata
  );
  return validateotpResponse;
};

const validateOTPMutationFN = (requestdata: ValidateOTP) => {
  return validateOTP(requestdata);
};

export const useValidateOTP = () => useMutation(validateOTPMutationFN);

