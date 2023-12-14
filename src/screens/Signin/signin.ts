import {AxiosResponse} from 'axios';
import  axiosInstance, { PostAxios }  from '../../Network/api';
import {useMutation} from 'react-query';

const login = async (credentials: LoginCredentials): Promise<User> => {


  const loginResponse = await PostAxios(
    "/app/dbs/userservice/userLogin",
    credentials
  );

  return loginResponse;
  
};

const loginMutationFn = (credentials: LoginCredentials) => {
  return login(credentials);
};

export const useLogin = () => useMutation(loginMutationFn);

export interface LoginCredentials {
  instituteCode: string;
  transmissionTime: number;
  userLoginId: string;
  password: string;
}

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

  accessToken:any;
  refreshToken:any;
}
