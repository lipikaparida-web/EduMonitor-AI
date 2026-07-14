import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Shield,
  User,
  Users,
} from "lucide-react";
import { UserRole } from "../types";
import { registerUser } from "../services/authService";

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
};

export default function Register({
  initialRole,
  onBack,
}: {
  initialRole?: UserRole;
  onBack?: () => void;
} = {}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole || "student");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await registerUser({
        user_id: `${role}_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        status: "active",
      });
      setMessage("Registration successful! You can now log in.");
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel = ROLE_LABEL[role] ?? role;

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

          {/* Header */}
          <div style={{ position: "relative", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <Logo size={26} />
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: "14px 0 4px", color: "var(--text)" }}>
                  {roleLabel} Register
                </h2>
                <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: 0 }}>
                  Create your {roleLabel.toLowerCase()} account
                </p>
              </div>
              <div style={{
                width: 70, height: 70, borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle, rgba(242,140,56,0.18) 0%, transparent 70%)",
              }} />
            </div>
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

            {/* Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 7 }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-muted)",
                }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="em-input"
                  placeholder="Your full name"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

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
                  placeholder="name@college.edu"
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

            {/* Message */}
            {message && (
              <div style={{
                background: "var(--primary-light)",
                border: "1.5px solid var(--accent-soft)",
                color: "var(--primary)", fontSize: 13, fontWeight: 500,
                borderRadius: 8, padding: "10px 14px",
              }}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: "14px 20px", fontSize: 14, marginTop: 4, width: "100%", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <a href="#" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Login
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
