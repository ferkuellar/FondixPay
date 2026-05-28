import { useEffect, useState } from "react";

import { RequirePermission } from "./auth/RequirePermission";
import { useAdminAuth } from "./auth/AdminAuthProvider";
import { AdminLayout } from "./layout/AdminLayout";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { CardReconciliationPage } from "./pages/CardReconciliationPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DisputeDetailPage } from "./pages/DisputeDetailPage";
import { DisputesPage } from "./pages/DisputesPage";
import { FraudSignalDetailPage } from "./pages/FraudSignalDetailPage";
import { FraudSignalsPage } from "./pages/FraudSignalsPage";
import { LoginPage } from "./pages/LoginPage";
import { ManualReviewDetailPage } from "./pages/ManualReviewDetailPage";
import { ManualReviewPage } from "./pages/ManualReviewPage";
import { NotificationDeliveriesPage } from "./pages/NotificationDeliveriesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PaymentDetailPage } from "./pages/PaymentDetailPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { ProntipagosReconciliationPage } from "./pages/ProntipagosReconciliationPage";
import { ReceiptDetailPage } from "./pages/ReceiptDetailPage";
import { ReceiptsPage } from "./pages/ReceiptsPage";
import { SearchPage } from "./pages/SearchPage";
import { SupportTicketDetailPage } from "./pages/SupportTicketDetailPage";
import { SupportTicketsPage } from "./pages/SupportTicketsPage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { UsersPage } from "./pages/UsersPage";

function currentPath() {
  return window.location.hash.replace(/^#/, "") || "/dashboard";
}

function matchDetail(path: string, prefix: string): string | null {
  const match = path.match(new RegExp(`^/${prefix}/([^/]+)$`));
  return match?.[1] ?? null;
}

export function App() {
  const { isAuthenticated } = useAdminAuth();
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const syncPath = () => setPath(currentPath());
    window.addEventListener("hashchange", syncPath);
    return () => window.removeEventListener("hashchange", syncPath);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const userId = matchDetail(path, "users");
  const paymentId = matchDetail(path, "payments");
  const receiptId = matchDetail(path, "receipts");
  const ticketId = matchDetail(path, "tickets");
  const manualReviewId = matchDetail(path, "manual-review");
  const fraudSignalId = matchDetail(path, "fraud-signals");
  const disputeId = matchDetail(path, "disputes");

  return (
    <AdminLayout>
      {path === "/dashboard" ? <RequirePermission permission="admin.dashboard.view"><DashboardPage /></RequirePermission> : null}
      {path === "/users" ? <RequirePermission permission="admin.users.list"><UsersPage /></RequirePermission> : null}
      {userId ? <RequirePermission permission="admin.users.view"><UserDetailPage id={userId} /></RequirePermission> : null}
      {path === "/payments" ? <RequirePermission permission="admin.payments.list"><PaymentsPage /></RequirePermission> : null}
      {paymentId ? <RequirePermission permission="admin.payments.view"><PaymentDetailPage id={paymentId} /></RequirePermission> : null}
      {path === "/receipts" ? <RequirePermission permission="admin.receipts.list"><ReceiptsPage /></RequirePermission> : null}
      {receiptId ? <RequirePermission permission="admin.receipts.view"><ReceiptDetailPage id={receiptId} /></RequirePermission> : null}
      {path === "/notifications/deliveries" ? <RequirePermission permission="admin.notifications.list"><NotificationDeliveriesPage /></RequirePermission> : null}
      {path === "/search" ? <RequirePermission permission="admin.search.view"><SearchPage /></RequirePermission> : null}
      {path === "/tickets" ? <RequirePermission permission="admin.support_tickets.list"><SupportTicketsPage /></RequirePermission> : null}
      {ticketId ? <RequirePermission permission="admin.support_tickets.list"><SupportTicketDetailPage id={ticketId} /></RequirePermission> : null}
      {path === "/manual-review" ? <RequirePermission permission="admin.manual_review.list"><ManualReviewPage /></RequirePermission> : null}
      {manualReviewId ? <RequirePermission permission="admin.manual_review.view"><ManualReviewDetailPage id={manualReviewId} /></RequirePermission> : null}
      {path === "/fraud-signals" ? <RequirePermission permission="admin.fraud_signals.list"><FraudSignalsPage /></RequirePermission> : null}
      {fraudSignalId ? <RequirePermission permission="admin.fraud_signals.view"><FraudSignalDetailPage id={fraudSignalId} /></RequirePermission> : null}
      {path === "/disputes" ? <RequirePermission permission="admin.disputes.list"><DisputesPage /></RequirePermission> : null}
      {disputeId ? <RequirePermission permission="admin.disputes.view"><DisputeDetailPage id={disputeId} /></RequirePermission> : null}
      {path === "/reconciliation/card" ? <RequirePermission permission="admin.reconciliation.card.view"><CardReconciliationPage /></RequirePermission> : null}
      {path === "/reconciliation/prontipagos" ? <RequirePermission permission="admin.reconciliation.prontipagos.view"><ProntipagosReconciliationPage /></RequirePermission> : null}
      {path === "/audit-logs" ? <RequirePermission permission="admin.audit.list"><AuditLogsPage /></RequirePermission> : null}
      {![
        "/dashboard",
        "/users",
        "/payments",
        "/receipts",
        "/notifications/deliveries",
        "/search",
        "/tickets",
        "/manual-review",
        "/fraud-signals",
        "/disputes",
        "/reconciliation/card",
        "/reconciliation/prontipagos",
        "/audit-logs",
      ].includes(path) && !userId && !paymentId && !receiptId && !ticketId && !manualReviewId && !fraudSignalId && !disputeId ? <NotFoundPage /> : null}
    </AdminLayout>
  );
}
