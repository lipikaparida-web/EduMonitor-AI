/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import AdminPortal from "./components/AdminPortal";
import FacultyPortal from "./components/FacultyPortal";
import LandingPage from "./components/LandingPage";
import PlacementPortal from "./components/PlacementPortal";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentPortal from "./components/StudentPortal";

import { getDashboard } from "./services/dashboardService";
import { getStudentProfile, getStudents } from "./services/studentService";
import { useAuth } from "./hooks/useAuth";

import { Alert, Student } from "./types";
import ErrorPage from "./components/shared/ErrorPage";
import LoadingState from "./components/shared/LoadingState";

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dataError, setDataError] = useState("");
  const [portalLoading, setPortalLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setPortalLoading(false);
      return;
    }

    const loadPortalData = async () => {
      setDataError("");
      setPortalLoading(true);

      try {
        if (user.role === "student") {
          const response = await getStudentProfile();
          setStudents([response.data]);
          setAlerts([]);
          return;
        }

        if (user.role === "admin" || user.role === "super_admin") {
          const response = await getStudents();
          setStudents(response.data);
        }

        if (user.role === "faculty") {
          setStudents([]);
          setAlerts([]);
        }

        if (user.role === "admin" || user.role === "super_admin") {
          const response = await getDashboard();
          setAlerts(
            (response.data.alerts || []).map((alert: Alert, index: number) => ({
              ...alert,
              id: alert.id || `dashboard-${index}`,
              status: alert.status || "active",
            }))
          );
        }
      } catch (error: any) {
        setDataError(error?.response?.data?.detail || "Unable to load portal data.");
      } finally {
        setPortalLoading(false);
      }
    };

    loadPortalData();
  }, [isAuthenticated, user]);

  const loggedInStudent = students[0];

  if (isLoading || portalLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LoadingState type="spinner" message="Loading EduMonitor AI..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LandingPage />;
  }

  return (
    <div
      className="min-h-screen bg-[var(--bg)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-white"
      id="main-application-frame"
    >
      {dataError && (
        <div className="fixed inset-0 z-[60] bg-[var(--bg)]/90 backdrop-blur-sm flex items-center justify-center">
          <ErrorPage type="500" onRetry={() => window.location.reload()} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {(user.role === "admin" || user.role === "super_admin") && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
              <AdminPortal
                students={students}
                setStudents={setStudents}
                alerts={alerts}
                setAlerts={setAlerts}
                onLogout={logout}
              />
            </ProtectedRoute>
          </motion.div>
        )}

        {user.role === "faculty" && (
          <motion.div
            key="faculty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyPortal
                students={students}
                setStudents={setStudents}
                alerts={alerts}
                setAlerts={setAlerts}
                onLogout={logout}
              />
            </ProtectedRoute>
          </motion.div>
        )}

        {user.role === "student" && loggedInStudent && (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPortal
                currentStudent={loggedInStudent}
                onLogout={logout}
              />
            </ProtectedRoute>
          </motion.div>
        )}

        {user.role === "placement_officer" && (
          <motion.div
            key="placement"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <ProtectedRoute allowedRoles={["placement_officer"]}>
              <PlacementPortal students={students} onLogout={logout} />
            </ProtectedRoute>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
