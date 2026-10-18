/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

export interface ILoginActionResult {
    success: boolean;
    message?: string;
    redirectUrl?: string;
    data?: any;
}

export const loginAction = async (payload : ILoginPayload, redirectPath ?: string ) : Promise<ILoginActionResult> =>{
    const parsedPayload = loginZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0]?.message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<any>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, needPasswordChange, email } = user;
        
        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }
        if (refreshToken) {
            await setTokenInCookies("refreshToken", refreshToken);
        }
        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        let targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);

        if (needPasswordChange) {
            targetPath = `/reset-password?email=${encodeURIComponent(email)}`;
        }

        return {
            success: true,
            message: "Login successful",
            redirectUrl: targetPath,
            data: response.data,
        };
        
    } catch (error : any) {
        console.error("Login action error:", error?.response?.data || error?.message);

        const serverMsg = error?.response?.data?.message || error?.message || "Login failed";
        
        if (serverMsg === "Email not verified") {
            return {
                success: false,
                message: serverMsg,
                redirectUrl: `/verify-email?email=${encodeURIComponent(payload.email)}`,
            };
        }

        return {
            success: false,
            message: serverMsg.startsWith("Request failed") 
                ? (error?.response?.data?.message || "Invalid email or password. Please check your credentials.") 
                : serverMsg,
        };
    }
}