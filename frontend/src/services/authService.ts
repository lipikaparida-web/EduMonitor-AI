import api from "./api";
import { AuthUser, UserRole } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: "active" | "inactive";
  linked_record_id?: string;
}

export interface LoginResponse extends AuthUser {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<AuthUser>("/auth/me");
  return response.data;
};

export const refreshToken = async (refresh_token: string) => {
  const response = await api.post<{ access_token: string; token_type: "bearer" }>(
    "/auth/refresh",
    { refresh_token }
  );
  return response.data;
};
