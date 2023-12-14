import  { PostAxios } from '../../Network/api';
import {useMutation} from 'react-query';
import {User} from '../Signin/signin';

const signUp = async (registerData: SignUpRequest): Promise<User> => {

  const registerResponse = await PostAxios(
    "/app/dbs/userservice/userRegister",
    registerData
  );
  return registerResponse;
};

const signUpMutationFn = (registerData: SignUpRequest) => {
  return signUp(registerData);
};

export const useSignUp = () => useMutation(signUpMutationFn);


const findDbsUser = async (data: any): Promise<User> => {

  const response = await PostAxios(
    "/app/dbs/userservice/findDbsUserById",
    data
  );
  return response;
};

const findDbsUserMutationFn = (data:any) => {
  return findDbsUser(data);
};

export const useFindDbsUser = () => useMutation(findDbsUserMutationFn);


export interface SignUpRequest {
  instituteCode: string;
  transmissionTime: number;
  birthDate: string;
  email: string;
  failedLoginNo: number;
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  errorSeverity: null;
}
