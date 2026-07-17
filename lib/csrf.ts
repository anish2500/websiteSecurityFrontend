"use server"; 
import crypto from "crypto"; 
import { getCsrfToken, setCsrfToken} from "./cookie"; 

export async function issueCsrfToken (): Promise<string>{
    const token = crypto.randomBytes(32).toString("hex");
    await setCsrfToken(token); 
    return token; 
}

export async function verifyCsrfToken(submitted: string | undefined): Promise<boolean>{
    const stored = await getCsrfToken(); 
    return !!stored && !!submitted && stored ===submitted; 
}