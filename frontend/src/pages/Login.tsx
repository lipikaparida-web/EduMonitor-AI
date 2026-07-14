import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Shield,
  Users,
} from "lucide-react";

import { UserRole } from "../types";
import { useAuth } from "../hooks/useAuth";

/* ── Logo ─────────────────────────────────────────────────────── */
function Logo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: size,
          height: size,
          background: "var(--primary)",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GraduationCap size={size * 0.58} color="white" />
      </div>
      <span style={{ fontWeight: 800, fontSize: size * 0.62, color: "var(--text)", letterSpacing: -0.5 }}>
        EduMonitor
      </span>
    </div>
  );
}

const ROLE_ICON: Record<string, React.ReactNode> = {
  admin: <Shield size={20} />,
  faculty: <Users size={20} />,
  student: <GraduationCap size={20} />,
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  faculty: "Faculty",
  student: "Student",
  super_admin: "Super Admin",
  placement_officer: "Placement Officer",
};

export default function Login({
  initialRole,
  onBack,
}: {
  initialRole?: UserRole;
  onBack?: () => void;
} = {}) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole || "admin");
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const roleLabel = ROLE_LABEL[role] ?? role;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setLocalError("");
    setForgotMessage("");

    if (!email.trim() || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password, role, remember);
    } catch {
      // AuthContext exposes the backend error.
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  /* Demo credentials per role */
  const demoMap: Record<string, { email: string; password: string }> = {
    admin: { email: "admin@college.edu", password: "admin123" },
    faculty: { email: "faculty@college.edu", password: "faculty123" },
    student: { email: "student@college.edu", password: "student123" },
  };
  const demo = demoMap[role];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "18px 40px",
        display: "flex", alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "white",
      }}>
        <Logo />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div className="em-card" style={{ width: "100%", maxWidth: 460, padding: "36px 40px" }}>

          {/* Top blob decoration */}
          <div style={{
            position: "relative", marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <Logo size={26} />
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: "14px 0 4px", color: "var(--text)" }}>
                  {roleLabel} Login
                </h2>
                <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: 0 }}>
                  Enter your credentials to access {roleLabel.toLowerCase()} portal
                </p>
              </div>
              <div style={{
                width: 70, height: 70, borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle, rgba(242,140,56,0.18) 0%, transparent 70%)",
              }} />
            </div>

            {/* Role icon badge */}
            <div style={{
              position: "absolute", bottom: -20, right: 0,
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--primary)", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-orange)",
            }}>
              {ROLE_ICON[role] ?? <Shield size={20} />}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>

            {/* Error */}
            {(localError || error) && (
              <div style={{
                background: "#FEF2F2", border: "1.5px solid #FECACA",
                color: "#DC2626", fontSize: 13, fontWeight: 600,
                borderRadius: 8, padding: "10px 14px",
              }}>
                {localError || error}
              </div>
            )}
            {forgotMessage && (
              <div style={{
                background: "var(--primary-light)", border: "1.5px solid var(--accent-soft)",
                color: "var(--primary)", fontSize: 13, fontWeight: 500,
                borderRadius: 8, padding: "10px 14px",
              }}>
                {forgotMessage}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 7 }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)",
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="em-input"
                  placeholder={demo?.email ?? "name@college.edu"}
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)",
                  fontSize: 18, lineHeight: 1,
                }}>
                  ●●●●●●
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="em-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 500, color: "var(--text-2)", cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "var(--primary)", width: 15, height: 15 }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotMessage("Password reset requires admin contact. Use demo credentials below.")}
                style={{
                  fontSize: 13, fontWeight: 600, color: "var(--primary)",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: "100%", justifyContent: "center",
                padding: "14px", fontSize: 15,
                borderRadius: 10, opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Demo note */}
          {demo && (
            <div style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "var(--primary-pale)",
              border: "1.5px dashed var(--border-orange)",
              borderRadius: 10,
              fontSize: 12.5,
              color: "var(--text-2)",
              lineHeight: 1.7,
            }}>
              <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 12 }}>Demo Credentials</span><br />
              Email: <strong>{demo.email}</strong><br />
              Password: <strong>{demo.password}</strong>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <a href="#" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Register
            </a>
          </div>

          {onBack && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={onBack}
                style={{
                  fontSize: 13, color: "var(--text-muted)",
                  background: "none", border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
