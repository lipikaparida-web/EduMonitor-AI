import React, { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Rocket,
  ShieldCheck,
  Users,
  Linkedin,
  Github,
  Twitter,
  Youtube,
} from "lucide-react";
import LoginPortal from "../pages/Login";
import RegisterPortal from "../pages/Register";

type PortalRole = "admin" | "faculty" | "student";

/* ── Logo ─────────────────────────────────────────────────────── */
function Logo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          background: "var(--primary)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GraduationCap size={size * 0.55} color="white" />
      </div>
      <span style={{ fontWeight: 800, fontSize: size * 0.62, color: "var(--text)", letterSpacing: -0.5 }}>
        EduMonitor
      </span>
    </div>
  );
}

/* ── Nav ──────────────────────────────────────────────────────── */
function Navbar({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <nav className="em-navbar">
      <Logo />
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {["Features", "Portals", "About", "Contact"].map((item) => (
          <a
            key={item}
            href="#"
            style={{ fontSize: 14, fontWeight: 500, color: "var(--text-2)", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--primary)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-2)")}
          >
            {item}
          </a>
        ))}
      </div>
      <button
        className="btn-ghost"
        style={{ padding: "9px 22px", fontSize: 14, borderRadius: 50, display: "flex", alignItems: "center", gap: 8 }}
        onClick={onLogin}
      >
        Demo Login <Users size={15} />
      </button>
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */
function Hero({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <section
      style={{
        paddingTop: 68,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed university background image */}
      <img
        src="/assets/college_hero.png"
        alt="University campus"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.18,
          filter: "sepia(30%) brightness(0.95)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Warm gradient overlay so text pops cleanly */}
      <div style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(255,247,242,0.85) 0%, rgba(255,243,232,0.70) 40%, rgba(255,247,242,0.90) 100%)",
        pointerEvents: "none",
      }} />

      {/* Text content */}
      <div style={{
        maxWidth: 780, margin: "0 auto", padding: "80px 24px 80px",
        textAlign: "center", position: "relative", zIndex: 2,
      }}>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 12, letterSpacing: 0.5 }}>
          Welcome to
        </p>
        <h1 style={{ fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 900, lineHeight: 1.05, margin: 0 }}>
          <span style={{ color: "var(--text)" }}>Edu</span>
          <span style={{ color: "var(--primary)" }}>Monitor</span>
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-2)", margin: "20px 0 36px", lineHeight: 1.6 }}>
          AI-Powered College Management System<br />
          <span style={{ color: "var(--text-muted)", fontSize: 15 }}>for a Smarter Tomorrow</span>
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={onLogin} style={{ fontSize: 16, padding: "14px 36px" }}>
            Login <ArrowRight size={18} />
          </button>
          <button className="btn-ghost" onClick={onRegister} style={{ fontSize: 16, padding: "14px 32px" }}>
            Register <ArrowRight size={18} />
          </button>
        </div>

        <div style={{ marginTop: 48, color: "var(--text-muted)", display: "flex", justifyContent: "center" }}>
          <ChevronDown size={22} style={{ animation: "bounce 2s infinite" }} />
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }`}</style>
    </section>
  );
}

/* ── Feature strip ────────────────────────────────────────────── */
function FeatureStrip() {
  const features = [
    { icon: <BrainCircuit size={18} />, title: "AI-Powered Insights", sub: "Predict student performance, identify learning gaps, and provide intelligent recommendations." },
    { icon: <LayoutDashboard size={18} />, title: "Real-Time Analytics", sub: "Monitor attendance, academics, assignments, placements, and institutional performance from one unified dashboard." },
    { icon: <Users size={18} />, title: "Role-Based Experience", sub: "Dedicated workspaces for Students, Faculty, and Administrators with personalized dashboards and AI assistance." },
  ];

  return (
    <div style={{
      background: "white",
      padding: "80px 40px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32,
      }}>
        {features.map((f) => (
          <div key={f.title} className="em-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "var(--primary-light)", border: "1.5px solid var(--accent-soft)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--primary)",
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Interactive Dashboard Preview ───────────────────────────── */
function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<"student" | "faculty" | "admin">("student");

  const tabs = [
    { id: "student", label: "Student" },
    { id: "faculty", label: "Faculty" },
    { id: "admin", label: "Admin" },
  ] as const;

  return (
    <section style={{ padding: "80px 40px", background: "var(--surface-raised)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "var(--text)", marginBottom: 32 }}>One Platform. Three Perspectives.</h2>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "btn-primary" : "btn-ghost"}
              style={{ padding: "10px 24px", fontSize: 15, borderRadius: 50, fontWeight: 600, border: activeTab !== tab.id ? "1.5px solid var(--border)" : "none", cursor: "pointer", transition: "all 0.2s ease" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Mockup Container */}
        <div className="em-card" style={{ padding: 0, overflow: "hidden", borderRadius: 16, border: "2px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", aspectRatio: "16/9", background: "var(--bg)", display: "flex" }}>
          {/* Sidebar */}
          <div style={{ width: "20%", borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 20, borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--primary)" }} />
              <div style={{ height: 14, width: "60%", borderRadius: 4, background: "var(--border)" }} />
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 36, borderRadius: 8, background: i === 0 ? "var(--primary-light)" : "transparent", display: "flex", alignItems: "center", padding: "0 12px", gap: 12 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: i === 0 ? "var(--primary)" : "var(--border)" }} />
                  <div style={{ height: 8, width: i === 0 ? "60%" : "80%", borderRadius: 4, background: i === 0 ? "var(--primary)" : "var(--border)" }} />
                </div>
              ))}
            </div>
          </div>
          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ height: 64, borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
              <div style={{ height: 16, width: 120, borderRadius: 8, background: "var(--border)" }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--border)" }} />
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--border)" }} />
              </div>
            </div>
            {/* Content area */}
            <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", gap: 24 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 120, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", padding: 20 }}>
                     <div style={{ height: 12, width: 60, borderRadius: 4, background: "var(--border)", marginBottom: 16 }} />
                     <div style={{ height: 32, width: 80, borderRadius: 6, background: "var(--border-orange)", opacity: 0.5 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 24, flex: 1 }}>
                <div style={{ flex: 2, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontWeight: 600, fontSize: 18, animation: "fade-in 0.3s ease" }}>
                  {activeTab === "student" ? "Student Dashboard Interface" : activeTab === "faculty" ? "Faculty Command Center" : "Admin Dashboard Overview"}
                </div>
                <div style={{ flex: 1, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Call to Action ────────────────────────────────────────────── */
function CallToAction({ onLogin }: { onLogin: () => void }) {
  return (
    <section style={{ padding: "120px 40px", textAlign: "center", background: "white" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: "var(--text)", marginBottom: 16, lineHeight: 1.2 }}>Ready to Experience Smarter Education?</h2>
        <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.6 }}>
          Empower students, faculty, and administrators with one intelligent AI-powered platform.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button className="btn-primary" onClick={onLogin} style={{ padding: "14px 36px", fontSize: 16 }}>Get Started</button>
          <button className="btn-ghost" onClick={onLogin} style={{ padding: "14px 36px", fontSize: 16, border: "1.5px solid var(--border)" }}>Request Demo</button>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1.5px solid var(--border)", padding: "60px 40px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 60 }}>
        <div>
          <Logo />
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
            AI-Powered College Management Platform
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 20 }}>Platform</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Student</a>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Faculty</a>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Admin</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 20 }}>Resources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Help Center</a>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Documentation</a>
            <a href="#" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>Contact</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 20 }}>Social</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#" style={{ color: "var(--text-2)" }}><Linkedin size={20} /></a>
            <a href="#" style={{ color: "var(--text-2)" }}><Github size={20} /></a>
            <a href="#" style={{ color: "var(--text-2)" }}><Twitter size={20} /></a>
            <a href="#" style={{ color: "var(--text-2)" }}><Youtube size={20} /></a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", borderTop: "1px solid var(--border-light)", paddingTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        © 2026 EduMonitor. All rights reserved.
      </div>
    </footer>
  );
}

/* ── Main LandingPage ─────────────────────────────────────────── */
export default function LandingPage() {
  const [view, setView] = useState<"home" | "login-select" | "register-select" | "login-form" | "register-form">("home");
  const [selectedRole, setSelectedRole] = useState<PortalRole>("admin");


  // If showing actual login/register forms, render them full-screen
  if (view === "login-form") {
    return (
      <LoginPortal
        initialRole={selectedRole}
        onBack={() => setView("login-select")}
      />
    );
  }
  if (view === "register-form") {
    return (
      <RegisterPortal
        initialRole={selectedRole}
        onBack={() => setView("register-select")}
      />
    );
  }

  // Portal selection overlays
  if (view === "login-select" || view === "register-select") {
    const isLogin = view === "login-select";
    return (
      <PortalSelector
        mode={isLogin ? "login" : "register"}
        onSelect={(role) => {
          setSelectedRole(role);
          setView(isLogin ? "login-form" : "register-form");
        }}
        onBack={() => setView("home")}
        onSwitch={() => setView(isLogin ? "register-select" : "login-select")}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar
        onLogin={() => setView("login-select")}
        onRegister={() => setView("register-select")}
      />
      <Hero
        onLogin={() => setView("login-select")}
        onRegister={() => setView("register-select")}
      />
      <FeatureStrip />
      <InteractiveDashboard />
      <CallToAction onLogin={() => setView("login-select")} />
      <Footer />
    </div>
  );
}

/* ── Portal Selector (Login / Register chooser) ───────────────── */
function PortalSelector({
  mode,
  onSelect,
  onBack,
  onSwitch,
}: {
  mode: "login" | "register";
  onSelect: (role: PortalRole) => void;
  onBack: () => void;
  onSwitch: () => void;
}) {
  const [hovered, setHovered] = useState<PortalRole | null>(null);

  const roles: { key: PortalRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "admin",
      label: "Admin",
      desc: "Full access to all modules, users, and system settings.",
      icon: <ShieldCheck size={24} />,
    },
    {
      key: "faculty",
      label: "Faculty",
      desc: "Manage classes, students, attendance and more.",
      icon: <Users size={24} />,
    },
    {
      key: "student",
      label: "Student",
      desc: "Access your academics, resources and progress.",
      icon: <GraduationCap size={24} />,
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
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
        <div className="em-card" style={{ width: "100%", maxWidth: 560, padding: 40 }}>
          {/* Top decoration */}
          <div style={{
            position: "relative", marginBottom: 28,
            paddingBottom: 24,
            borderBottom: "1.5px solid var(--border)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <Logo size={28} />
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: "16px 0 6px", color: "var(--text)" }}>
                  {mode === "login" ? "Login" : "Register"}
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
                  {mode === "login" ? "Choose your portal to continue" : "Choose your portal to create account"}
                </p>
              </div>
              {/* Decorative orange blob */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(242,140,56,0.2) 0%, transparent 70%)",
              }} />
            </div>
          </div>

          {/* Role cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
            {roles.map((r) => (
              <button
                key={r.key}
                className={`role-card ${hovered === r.key ? "selected" : ""}`}
                onMouseEnter={() => setHovered(r.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(r.key)}
              >
                <div className="role-card-icon">{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{r.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.4 }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Footer link */}
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
            {mode === "login" ? (
              <>New here?{" "}
                <button onClick={onSwitch} style={{ color: "var(--primary)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                  Register
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={onSwitch} style={{ color: "var(--primary)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                  Login
                </button>
              </>
            )}
          </div>

          {/* Back button */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={onBack}
              style={{
                fontSize: 13, color: "var(--text-muted)",
                background: "none", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
