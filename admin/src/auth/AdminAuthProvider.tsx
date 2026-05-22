import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { isAdminRole, getPermissions } from "./permissions";
import type { AdminRole, Permission } from "../types/admin";

const TOKEN_KEY = "fondixpay_admin_token";
const DEV_AUTH_ENABLED = import.meta.env.VITE_ENABLE_ADMIN_DEV_AUTH === "true";
const CONFIGURED_DEV_ROLE = import.meta.env.VITE_ADMIN_DEV_ROLE;

type AdminSession = {
  token: string | null;
  role: AdminRole | null;
  permissions: Permission[];
  devAuthEnabled: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, role?: AdminRole) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
};

const AdminAuthContext = createContext<AdminSession | null>(null);

function readInitialToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

function configuredRole(): AdminRole | null {
  return DEV_AUTH_ENABLED && isAdminRole(CONFIGURED_DEV_ROLE) ? CONFIGURED_DEV_ROLE : null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readInitialToken);
  const [role, setRole] = useState<AdminRole | null>(configuredRole);

  const value = useMemo<AdminSession>(() => {
    const permissions = getPermissions(role);

    return {
      token,
      role,
      permissions,
      devAuthEnabled: DEV_AUTH_ENABLED,
      isAuthenticated: Boolean(token && role),
      signIn: (nextToken, nextRole) => {
        const resolvedRole = nextRole ?? configuredRole();
        if (!resolvedRole) {
          throw new Error("No admin role is available for this session.");
        }
        sessionStorage.setItem(TOKEN_KEY, nextToken);
        setToken(nextToken);
        setRole(resolvedRole);
      },
      logout: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setRole(configuredRole);
      },
      hasPermission: (permission) => permissions.includes(permission),
    };
  }, [role, token]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminSession {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  }
  return context;
}
