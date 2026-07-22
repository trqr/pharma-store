import {api} from "../../../api/axios.config.ts";
import type {LoginRequest} from "../types/LoginRequest.ts";
import type {RegisterRequest} from "../types/RegisterRequest.ts";

export const register = async (data: RegisterRequest) => {
    const res = await api.post("auth/register", data);
    return res.data;
}

export const login = async (data: LoginRequest) => {
        const res = await api.post("auth/login", data);
        return res.data;
}

export const getCurrentUserWithToken = async () => {
    const res = await api.get("auth/me");
    return res.data;
}