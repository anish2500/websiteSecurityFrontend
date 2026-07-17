"use server"
import { cookies } from "next/headers"

export interface UserData {
    _id: string; 
    email : string; 
    fullName? : string; 
    username? : string; 
    profilePicture ?: string ; 
    role : 'user' | 'admin'; 
    createdAt : string; 
    updatedAt : string; 
    [key:string] : any; 

}


export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
}

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}
export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    // cookie can only store string
    // convert object to string -> JSON.stringify "{}"
    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
}


export const setRefreshToken = async (token: string) => {
    const cookieStore = await cookies ();
    cookieStore.set({
        name: "refresh_token", 
        value: token, 
        httpOnly: true, 
        secure: process.env.NODE_ENV ==="production",
        sameSite: "lax", 
        path: "/", 
        maxAge: 60*60*24*7, 

    });
}


export const getRefreshToken = async () =>{
    const cookieStore  = await cookies(); 
    return cookieStore.get("refresh_token")?.value|| null; 
}

export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        // convert string to object -> JSON.parse
        return JSON.parse(userData);
    }
    return null;
}
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
    cookieStore.delete("refresh_token");
}


export const setCsrfToken = async (token: string) =>{
    const cookieStore = await cookies(); 
    cookieStore.set({
        name: "csrf-token", 
        value: token, 
        httpOnly: false, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        path: "/", 
    });
}


export const getCsrfToken = async () =>{
    const cookieStore = await cookies(); 
    return cookieStore.get("csrf-token")?.value || null; 
}