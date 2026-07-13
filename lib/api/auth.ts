import axios from "./axios";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import {API} from "./endpoints";

// Carries the full backend response body (not just the message) so callers
// can read extra fields like `captchaRequired` after a failed request.
export class ApiError extends Error {
    data?: any;
    constructor(message: string, data?: any) {
        super(message);
        this.data = data;
    }
}

export const register = async (registerData: RegisterData)=>{
    try {
        const response = await axios.post(
            API.AUTH.REGISTER,
            registerData
        );
        return response.data;
    }catch (err: Error | any){
        throw new ApiError(
            err.response?.data?.message || err.message || 'Registration Failed',
            err.response?.data
        );
    }
}

export const login = async (loginData: LoginData)=>{
    try {
        const response = await axios.post(
            API.AUTH.LOGIN,
            loginData
        );
        return response.data;
    }catch (err: Error | any){
        throw new ApiError(
            err.response?.data?.message || err.message || 'Login Failed',
            err.response?.data
        );
    }
}


export const whoAmI = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Whoami failed');
  }
}


export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(
      API.AUTH.UPDATE_PROFILE,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // for file upload/multer
        }
      }
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message
      || error.message || 'Update profile failed');
  }
}



export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}


export const setupMfa = async () =>{
    try {
        const response = await axios.post(API.AUTH.MFA_SETUP);
        return response.data; 
    } catch (err: Error | any) {
        throw new ApiError(err.response?.data?.message || err.message || 'MFA setup failed', err.response?.data);
    }
}


export const verifyMfaSetup = async (token: string) => {
    try {
        const response = await axios.post(API.AUTH.MFA_VERIFY_SETUP, { token });
        return response.data;
    } catch ( err: Error | any){
        throw new ApiError (err.response?.data?.message || err.message || 'MFA verification failed', err.response?.data);

    }
}

export const mfaChallenge = async ( mfaChallengeToken: string, token: string) => {
    try {
        const response = await axios.post(API.AUTH.MFA_CHALLENGE, { mfaChallengeToken, token});
        return response.data;


    } catch (err: Error | any){
        throw new ApiError (err.response?.data?.message || err.message || 'MFA challenge failed', err.response?.data);
    }
}

export const disableMfa = async () => {
    try {
        const response = await axios.post(API.AUTH.MFA_DISABLE);
        return response.data; 
    } catch (err: Error | any) {
        throw new ApiError(err.response?.data?.message || err.message || 'MFA disable failed', err.response?.data);
    }
}


export const refreshAccessToken = async (refreshToken: string) =>{
    try {
        const response = await axios.post(API.AUTH.REFRESH, { refreshToken});
        return response.data;

    } catch (err: Error | any) {
        throw new ApiError(err.response?.data?.message || err.message || 'Token refresh failed', err.response?.data);
    }
}

export const logoutRequest = async (refreshToken: string) => {
    try {
        const response = await axios.post(API.AUTH.LOGOUT, { refreshToken });
        return response.data;
    } catch (err: Error | any) {
        throw new ApiError(err.response?.data?.message || err.message || 'Logout failed', err.response?.data);
    }
}
