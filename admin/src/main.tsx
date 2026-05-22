import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { AdminAuthProvider } from "./auth/AdminAuthProvider";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </React.StrictMode>,
);
