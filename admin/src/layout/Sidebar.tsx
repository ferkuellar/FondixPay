import type { Permission } from "../types/admin";
import { useAdminAuth } from "../auth/AdminAuthProvider";

type NavItem = {
  href: string;
  label: string;
  permission: Permission;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#/dashboard", label: "Dashboard", permission: "admin.dashboard.view" },
  { href: "#/users", label: "Usuarios", permission: "admin.users.list" },
  { href: "#/payments", label: "Pagos", permission: "admin.payments.list" },
  { href: "#/receipts", label: "Recibos", permission: "admin.receipts.list" },
  { href: "#/search", label: "Busqueda", permission: "admin.search.view" },
  { href: "#/tickets", label: "Tickets", permission: "admin.support_tickets.list" },
  { href: "#/manual-review", label: "Revision manual", permission: "admin.manual_review.list" },
  { href: "#/reconciliation/card", label: "Conciliacion tarjeta", permission: "admin.reconciliation.card.view" },
  {
    href: "#/reconciliation/prontipagos",
    label: "Conciliacion Prontipagos",
    permission: "admin.reconciliation.prontipagos.view",
  },
  { href: "#/audit-logs", label: "Audit logs", permission: "admin.audit.list" },
];

export function Sidebar() {
  const { hasPermission } = useAdminAuth();

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <strong>FondixPay</strong>
        <span>CRM Admin</span>
      </div>
      <nav aria-label="Modulos admin">
        {NAV_ITEMS.filter((item) => hasPermission(item.permission)).map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
