"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload) => {
    const parsedResult = registerZodSchema.safeParse(payload);

    if (!parsedResult.success) {
        return {
            success: false,
            message: parsedResult.error.issues?.[0]?.message || "Invalid registration data",
        };
    }

    try {
        const response = await httpClient.post<{
            token?: string;
            accessToken?: string;
            refreshToken?: string;
        }>("/auth/register", {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        });

        if (response?.data?.accessToken) {
            await setTokenInCookies("accessToken", response.data.accessToken);
        }
        if (response?.data?.refreshToken) {
            await setTokenInCookies("refreshToken", response.data.refreshToken);
        }
        if (response?.data?.token) {
            await setTokenInCookies("better-auth.session_token", response.data.token, 24 * 60 * 60);
        }
    } catch (error: any) {
        console.error("Registration error:", error?.response?.data || error.message);
        return {
            success: false,
            message: error?.response?.data?.message || "Registration failed. Please try again.",
        };
    }

    redirect("/dashboard");
};
