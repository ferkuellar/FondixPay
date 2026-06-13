import { useState, type FormEvent } from "react";

import { useAdminAuth } from "../auth/AdminAuthProvider";
import { isAdminRole } from "../auth/permissions";
import { createAdminClient, type AdminTokenResponse } from "../api/adminClient";
import type { AdminRole } from "../types/admin";

const ROLES: AdminRole[] = ["SUPPORT", "FINANCE", "ADMIN", "AUDITOR", "SUPER_ADMIN"];

type Step = "phone" | "otp" | "token";

const anonClient = createAdminClient(() => null);

export function LoginPage() {
  const { signIn, devAuthEnabled, role, logout } = useAdminAuth();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devRole, setDevRole] = useState<AdminRole>(isAdminRole(role) ? role : "SUPER_ADMIN");
  const [pasteToken, setPasteToken] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpDev, setOtpDev] = useState<string | null>(null);
  const [expiredSession] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("expired") === "1";
  });

  const requestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await anonClient.adminRequestOtp(phone.trim());
      setOtpDev(res.otp_dev ?? null);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el codigo.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res: AdminTokenResponse = await anonClient.adminLogin(phone.trim(), otp.trim());
      const resolvedRole = devAuthEnabled ? devRole : (res.role as AdminRole);
      signIn(res.access_token, resolvedRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo verificar el codigo.");
    } finally {
      setLoading(false);
    }
  };

  const submitToken = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!pasteToken.trim()) {
      setError("Pega un bearer token emitido por el backend.");
      return;
    }
    try {
      signIn(pasteToken.trim(), devAuthEnabled ? devRole : undefined);
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "No se pudo iniciar la sesion.");
    }
  };

  return (
    <div className="login-shell">
      <section className="login-panel">
        <div>
          <strong>FondixPay CRM Admin</strong>
          <h1>Acceso operativo interno</h1>
          {expiredSession && (
            <p className="form-error" style={{ marginBottom: 12 }}>
              Tu sesion expiro. Inicia sesion nuevamente.
            </p>
          )}
        </div>

        {step === "phone" && (
          <form onSubmit={requestOtp}>
            <p style={{ color: "var(--crm-muted)", fontSize: 13, marginBottom: 16 }}>
              Ingresa el telefono de tu cuenta de operador para recibir el codigo de acceso.
            </p>
            <label>
              Telefono admin
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5512345678"
                autoComplete="tel"
                autoFocus
                disabled={loading}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Enviando…" : "Enviar codigo"}
            </button>
            <button
              type="button"
              className="button"
              style={{ marginTop: 8, background: "transparent", color: "var(--crm-muted)", border: "1px solid var(--crm-border)" }}
              onClick={() => { setShowFallback(!showFallback); setError(null); }}
            >
              {showFallback ? "Ocultar acceso manual" : "Acceso manual (emergencia)"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp}>
            <p style={{ color: "var(--crm-muted)", fontSize: 13, marginBottom: 16 }}>
              Codigo enviado a <strong>{phone}</strong>. Ingresa el codigo de 6 digitos.
              {otpDev ? <> <span className="crm-badge" style={{ marginLeft: 6 }}>DEV: {otpDev}</span></> : null}
            </p>
            <label>
              Codigo OTP
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                disabled={loading}
              />
            </label>
            {devAuthEnabled && (
              <label>
                Rol de desarrollo
                <select value={devRole} onChange={(e) => setDevRole(e.target.value as AdminRole)}>
                  {ROLES.map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
            )}
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Verificando…" : "Entrar al CRM"}
            </button>
            <button
              type="button"
              style={{ marginTop: 8, background: "none", border: "none", color: "var(--crm-muted)", cursor: "pointer", fontSize: 13 }}
              onClick={() => { setStep("phone"); setOtp(""); setError(null); setOtpDev(null); }}
            >
              ← Cambiar telefono
            </button>
          </form>
        )}

        {showFallback && step === "phone" && (
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--crm-border)" }}>
            <p style={{ color: "var(--crm-muted)", fontSize: 12, marginBottom: 10 }}>
              Acceso de emergencia — pega un token generado manualmente.
            </p>
            <form onSubmit={submitToken}>
              <label>
                Bearer token
                <textarea value={pasteToken} onChange={(e) => setPasteToken(e.target.value)} rows={4} autoComplete="off" />
              </label>
              {devAuthEnabled ? (
                <label>
                  Rol
                  <select value={devRole} onChange={(e) => setDevRole(e.target.value as AdminRole)}>
                    {ROLES.map((value) => <option key={value}>{value}</option>)}
                  </select>
                </label>
              ) : (
                <p className="inline-warning">Dev auth deshabilitado. El token debe contener el rol.</p>
              )}
              {error ? <p className="form-error">{error}</p> : null}
              <button type="submit" className="button">Entrar con token</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
