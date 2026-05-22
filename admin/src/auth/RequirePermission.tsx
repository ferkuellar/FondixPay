import type { ReactNode } from "react";

import { ErrorState } from "../components/ErrorState";
import type { Permission } from "../types/admin";
import { useAdminAuth } from "./AdminAuthProvider";

export function RequirePermission({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { hasPermission } = useAdminAuth();

  if (!hasPermission(permission)) {
    return <ErrorState title="Acceso no permitido" message="Tu rol no tiene permiso para esta vista." />;
  }

  return <>{children}</>;
}
