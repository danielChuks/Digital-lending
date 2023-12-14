import { PostAxios } from "../../Network/api";
import { useMutation } from "react-query";
import { User } from "../Signin/signin";

const validateUser = async (
  requestdata: ValidateUserRequest
): Promise<User> => {
  const validateUserResponse = await PostAxios(
    "app/dbs/userservice/validateUser",
    requestdata
  );
  return validateUserResponse;
};

const validateUserMutationFN = (requestdata: ValidateUserRequest) => {
  return validateUser(requestdata);
};

export const useValidateUser = () => useMutation(validateUserMutationFN);

const updateUserProfile = async (
  requestdata: any
): Promise<User> => {
  const updateUserProfileResponse = await PostAxios(
    "app/dbs/userservice/updateUserProfile",
    requestdata
  );
  return updateUserProfileResponse;
};

const updateUserProfileMutationFN = (requestdata: any) => {
  return updateUserProfile(requestdata);
};

export const useUpdateUserProfile = () =>
  useMutation(updateUserProfileMutationFN);

export interface ValidateUserRequest {
  instituteCode: string;
  transmissionTime: number;
  mobile: string;
}

export interface PasswordRequest {
  instituteCode: string;
  transmissionTime: number;
  dbsUserId: number;
  failedLoginNo: number;
  password: string;
}
