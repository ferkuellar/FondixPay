import { useMemo } from "react";

import { useAdminAuth } from "../auth/AdminAuthProvider";
import { createAdminClient } from "./adminClient";

export function useAdminApi() {
  const { token, logout } = useAdminAuth();
  return useMemo(() => createAdminClient(() => token, () => logout(true)), [token, logout]);
}
