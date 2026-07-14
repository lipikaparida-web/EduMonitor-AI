import React from "react";

import { UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import ErrorPage from "./shared/ErrorPage";
import LoadingState from "./shared/LoadingState";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <LoadingState type="spinner" message="Restoring secure session..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <ErrorPage type="403" onHome={() => window.location.href = "/"} />
      </div>
    );
  }

  return <>{children}</>;
}
