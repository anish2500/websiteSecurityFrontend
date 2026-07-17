"use server";
import { LoginData, RegisterData } from "@/app/(auth)/schema"
import { redirect } from "next/navigation";
import { register, login, whoAmI, updateProfile, mfaChallenge, setupMfa, verifyMfaSetup, disableMfa, logoutRequest, refreshAccessToken, requestMagicLink, verifyMagicLink } from '@/lib/api/auth';
import { clearAuthCookies, getRefreshToken, setAuthToken, setRefreshToken, setUserData } from '@/lib/cookie';
import { revalidatePath } from 'next/cache';
import { resetPassword, requestPasswordReset } from "@/lib/api/auth";
import { updateUser } from "../api/admin/user";
import { headers } from "next/headers";
import { issueCsrfToken, verifyCsrfToken } from "../csrf";
import { getCsrfTokenClient } from "../utils/csrf-client";

export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data)
        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}
export const handleLogin = async (data: LoginData) => {
    try {
        const incomingHeaders = await headers(); 
        const userAgent = incomingHeaders.get("user-agent") || undefined; 
        const response = await login(data, userAgent); 
        if (response.mfaRequired) {
            return {
                success: true,
                mfaRequired: true,
                mfaChallengeToken: response.mfaChallengeToken,
            }
        }
        if (response.success) {
            await setAuthToken(response.accessToken)
            await issueCsrfToken();
            await setRefreshToken(response.refreshToken)
            await setUserData(response.data)
            return { success: true, message: 'Login successful', data: response.data }
        }
        return { success: false, message: response.message || 'Login failed' }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Login action failed',
            captchaRequired: Boolean(error.data?.captchaRequired),
        }
    }
}


export const handleMfaChallenge = async (mfaChallengeToken: string, token: string) => {
    try {
        const response = await mfaChallenge(mfaChallengeToken, token);
        if (response.success) {
            await setAuthToken(response.accessToken);
            await issueCsrfToken();
            await setRefreshToken(response.refreshToken);
            await setUserData(response.data);
            return { success: true, message: 'Login successful', data: response.data };
        }
        return { success: false, message: response.message || 'Invalid code' };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'MFA challenge failed' };
    }
}

export const handleSetupMfa = async () => {
    try {
        const response = await setupMfa();
        return response.success
            ? { success: true, qrCode: response.data.qrCode }
            : { success: false, message: response.message || 'MFA setup failed' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export const handleVerifyMfaSetup = async (token: string) => {
    
    try {
        const response = await verifyMfaSetup(token);
        return response.success
            ? { success: true, backupCodes: response.data.backupCodes }
            : { success: false, message: response.message || 'Invalid code' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export const handleDisableMfa = async (csrfToken: string) => {
    if (!(await verifyCsrfToken(csrfToken))){
        return { success: false, message: "Security check failed. Please refresh the page and try again"};
    }
    try {
        const response = await disableMfa();
        return { success: response.success, message: response.message };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}



export const handleLogout = async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
        try { await logoutRequest(refreshToken); } catch { /* clear cookies regardless */ }
    }
    await clearAuthCookies();
    return redirect('/login');
}


export const handleRefreshToken = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return { success: false };
    try {
        const response = await refreshAccessToken(refreshToken);
        if (response.success) {
            await setAuthToken(response.accessToken);
            await setRefreshToken(response.refreshToken);
            return { success: true };
        }
        return { success: false };
    } catch {
        await clearAuthCookies();
        return { success: false };
    }
}



export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                user:result.data, 
                message: 'Profile updated successfully',
                data: result.data
                
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}




export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};

export const handleRequestMagicLink = async (email: string) => {
    try {
        const response = await requestMagicLink(email);
        return { success: true, message: response.message || 'Check your email for a login link' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export const handleMagicLogin = async (token: string) => {
    try {
        const response = await verifyMagicLink(token);
        if (response.success) {
            await setAuthToken(response.accessToken);
            await issueCsrfToken(); 
            await setRefreshToken(response.refreshToken);
            await setUserData(response.data);
            return { success: true, message: 'Login successful', data: response.data };
        }
        return { success: false, message: response.message || 'Login link is invalid or expired' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}
