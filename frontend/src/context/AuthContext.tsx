import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { AuthUser, UserRole } from "../types";
import { getCurrentUser, login as loginRequest } from "../services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  login: (email: string, password: string, role: UserRole, remember: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_KEY = "edumonitor_access_token";
const REFRESH_KEY = "edumonitor_refresh_token";
const USER_KEY = "edumonitor_user";

const readStoredUser = (): AuthUser | null => {
  const stored =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
};

const clearStorage = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_KEY);
    storage.removeItem(REFRESH_KEY);
    storage.removeItem(USER_KEY);
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
    window.history.replaceState(null, "", "/login");
  }, []);

  useEffect(() => {
    const restore = async () => {
      const hasToken =
        localStorage.getItem(ACCESS_KEY) ||
        sessionStorage.getItem(ACCESS_KEY);

      if (!hasToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, [logout]);

  useEffect(() => {
    window.addEventListener("edumonitor:session-expired", logout);
    return () => window.removeEventListener("edumonitor:session-expired", logout);
  }, [logout]);

  const login = useCallback(
    async (email: string, password: string, role: UserRole, remember: boolean) => {
      setError("");
      const storage = remember ? localStorage : sessionStorage;

      try {
        const response = await loginRequest({ email, password, role });
        const authUser: AuthUser = {
          user_id: response.user_id,
          name: response.name,
          email: response.email,
          role: response.role,
          linked_record_id: response.linked_record_id,
        };

        clearStorage();
        storage.setItem(ACCESS_KEY, response.access_token);
        storage.setItem(REFRESH_KEY, response.refresh_token);
        storage.setItem(USER_KEY, JSON.stringify(authUser));
        setUser(authUser);

        const pathByRole: Record<UserRole, string> = {
          super_admin: "/admin/dashboard",
          admin: "/admin/dashboard",
          faculty: "/faculty/dashboard",
          student: "/student/dashboard",
          placement_officer: "/placement/dashboard",
        };
        window.history.replaceState(null, "", pathByRole[role]);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Login failed");
        throw err;
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      clearError: () => setError(""),
    }),
    [error, isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
