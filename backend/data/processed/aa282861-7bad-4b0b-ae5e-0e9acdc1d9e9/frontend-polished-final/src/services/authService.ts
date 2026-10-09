import api from "./api";
import { LoginRequest, RegisterRequest } from "@/types/auth";

const login = async (data: LoginRequest) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

const register = async (data: RegisterRequest) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export default {
    login,
    register,
};