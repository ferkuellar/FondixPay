import { useAdminAuth } from "./auth/AdminAuthProvider";
import { CrmVisualApp } from "./crm/CrmVisualApp";
import { LoginPage } from "./pages/LoginPage";

export function App() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <CrmVisualApp />;
}
