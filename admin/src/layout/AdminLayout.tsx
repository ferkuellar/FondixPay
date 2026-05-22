import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="workspace">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
