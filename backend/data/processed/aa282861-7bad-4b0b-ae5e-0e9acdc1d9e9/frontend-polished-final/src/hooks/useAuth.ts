"use client";

import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { saveToken } from "@/utils/token";

export const useAuth = () => {

    const router = useRouter();

    const login = async (email: string, password: string) => {

        const response = await authService.login({
            email,
            password,
        });

        if (response.token) {
            saveToken(response.token);
            router.push("/dashboard");
        }

        return response;
    };

    return {
        login,
    };
};