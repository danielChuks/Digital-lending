import axios from "axios";
// import { useCustomerContext } from "../context/customerDetailsContext";

const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
});

axiosInstance.interceptors.request.use(
    async (request: any) => {
        const configData = await fetchConfigInfo();
        request.baseURL = configData.baseUrl;
        request.timeout = configData.TIME_OUT;
        request.headers["X-Auth-Signature"] =
            configData.DBS_WEB_X_AUTH_SIGNATURE;
        request.headers["Client-Id"] = configData.DBS_WEB_CLIENT_ID;
        let accessToken = window.sessionStorage.getItem("accessToken");
        if (request.url.includes("refreshtoken")) {
            accessToken = window.sessionStorage.getItem("refreshToken");
        }
        if (
            undefined !== accessToken &&
            "undefined" !== accessToken &&
            null !== accessToken &&
            "null" !== accessToken
        ) {
            request.headers.Authorization = "Bearer " + accessToken;
        }

        request.data.channelId = configData.DBS_WEB_CHANNEL_ID;
        request.data.channelCode = configData.DBS_WEB_CHANNEL_CD;
        request.data.transmissionTime = Date.now();
        request.data.instituteCode = configData.instituteCode;
        // log.debug('Request Headers:', request.headers);

        return request;
    },
    (error) => {
        console.log("Axios Instance Error ", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;

export async function PostAxios(url: any, payload: any) {
    const apiResponse: any = {
        status: "",
        data: "",
        errorMessage: "",
        errorCode: "",
    };
    try {
        let response;
        if (
            url.indexOf("createDocument") !== -1 ||
            url.indexOf("modifyDocument") !== -1
        ) {
            response = await axiosInstance.post(url, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else {
            response = await axiosInstance.post(url, payload);
        }

        if (undefined !== response) {
            apiResponse.status = response.status;
            apiResponse.data = response.data;
        } else {
            apiResponse.status = 500;
            apiResponse.errorMessage = "Posting Response Error";
        }
    } catch (error: any) {
        if (
            undefined !== error.response &&
            error.response.data &&
            error.response.data[0].message
        ) {
            //Refresh Token Start
            if (
                error.response.data[0].code !== null &&
                error.response.data[0].code === "CI_JWT_002"
            ) {
                console.log(error.response.data[0].code);
                const originalRequest = error.config;
                const refreshTokenResponse = await refreshToken();
                if (refreshTokenResponse.status === 200) {
                    //Repost the orginal Transaction START
                    originalRequest.headers.Authorization = `Bearer ${refreshTokenResponse.response?.data?.accessToken}`;
                    try {
                        const repostResponse = await axios(originalRequest);
                        if (undefined !== repostResponse) {
                            apiResponse.status = repostResponse.status;
                            apiResponse.data = repostResponse.data;
                        } else {
                            apiResponse.status = 500;
                            apiResponse.errorMessage =
                                "Error in Reposting Response";
                        }
                    } catch (repostError: any) {
                        if (
                            undefined !== error.response &&
                            error.response.data &&
                            error.response.data[0].message
                        ) {
                            apiResponse.errorCode =
                                repostError.response.data[0].code;
                            apiResponse.status = repostError.response.status;
                            apiResponse.errorMessage =
                                repostError.response.data[0].message;
                        } else {
                            apiResponse.status = 500;
                            apiResponse.errorMessage = "Error in Reposting";
                        }
                    }
                    //Repost the orginal Transaction END
                } else {
                    return refreshTokenResponse;
                }
            } else {
                //Posting Error other than Token Expiry
                apiResponse.errorCode = error.response.data[0].code;
                apiResponse.status = error.response.status;
                apiResponse.errorMessage = error.response.data[0].message;
            }
        } else {
            apiResponse.status = 500;
            apiResponse.errorMessage = "Posting Error";
        }
    }
    return apiResponse;
}

const refreshToken = async () => {
    const refreshTokenResponse: any = {
        status: "",
        data: "",
        errorMessage: "",
        errorCode: "",
    };
    const refreshPaylod = {};
    try {
        const response = await axiosInstance.post(
            "auth/refreshtoken",
            refreshPaylod
        );
        if (response !== undefined) {
            refreshTokenResponse.status = response.status;
            refreshTokenResponse.data = response.data;
            window.sessionStorage.setItem(
                "accessToken",
                refreshTokenResponse.data.accessToken
            );
            window.sessionStorage.setItem(
                "refreshToken",
                refreshTokenResponse.data.refreshToken
            );
        } else {
            refreshTokenResponse.status = 500;
            refreshTokenResponse.errorMessage =
                "Error in Refresh Token Posting Response";
        }
    } catch (refreshError: any) {
        if (
            undefined !== refreshError.response &&
            refreshError.response.data &&
            refreshError.response.data[0].message
        ) {
            refreshTokenResponse.errorCode = refreshError.response.data[0].code;
            refreshTokenResponse.status = refreshError.response.status;
            refreshTokenResponse.errorMessage =
                refreshError.response.data[0].message;
        } else {
            refreshTokenResponse.status = 500;
            refreshTokenResponse.errorMessage =
                "Error in Refresh Token Posting";
        }
    }
    return refreshTokenResponse;
};

export const fetchConfigInfo = async () => {
    let data;
    try {
        const res = await fetch("/applicationProperties.json");
        data = await res.json();
    } catch (error) {
        console.log("Error in  Read Config", error);
    }
    return data;
};
