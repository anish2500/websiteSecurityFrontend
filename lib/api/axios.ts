import axios from "axios";
import { clearAuthCookies, getAuthToken, getRefreshToken, setAuthToken, setRefreshToken } from "../cookie";
import { refreshAccessToken } from "./auth";
import {headers} from "next/headers"; 

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
const axiosInstance  = axios.create(
    {
        baseURL : BASE_URL,
        headers: {
            "Content-Type" : "application/json",
        },
    }
)
function isExpired(token: string): boolean {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}


axiosInstance.interceptors.request.use(
    async (config) => {
        let token = await getAuthToken();
       

        if (token && isExpired(token)) {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await refreshAccessToken(refreshToken);
                    if (response.success) {
                        token = response.accessToken;
                        await setAuthToken(response.accessToken);
                        await setRefreshToken(response.refreshToken);
                    }
                } catch {
                    await clearAuthCookies();
                    token = null;
                }
            }
        }

        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
