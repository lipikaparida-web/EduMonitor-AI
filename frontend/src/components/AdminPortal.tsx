import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Users, GraduationCap, BrainCircuit, UserCog, Briefcase,
  Search, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle, Send, Sparkles,
  Download, FileText, Lock, Mail, BookOpen, ChevronRight, Award, Plus, LogOut,
  Check, Landmark, Eye, Pencil, Trash2, X, Save, Menu, Activity, Bell, Building2,
  CalendarCheck, Clock, FileBadge, FolderOpen, HeartPulse, Receipt, Target, MessageSquare, Settings, AlertCircle, FileCheck, Calendar as CalendarIcon, File as FileIcon, LifeBuoy
} from "lucide-react";

import { Student, Alert, ChatMessage, Admin } from "../types";
import { adminProfile } from "../data/mockData";
import { getStudentReport } from "../services/aiServices";

interface DashboardPayload {
  students: number;
  faculty: number;
  departments: number;
  subjects: number;
  courses: number;
  placements: number;
  companies: number;
  semesters: number;
  placement_ready: number;
  average_cgpa: number;
  average_attendance: number;
  average_sgpa: number;
  average_semester_attendance: number;
  department_distribution: Array<{ name: string; value: number }>;
  semester_distribution?: Array<{ name: string; value: number }>;
  placement_statistics?: Array<{ name: string; value: number }>;
  attendance_trend?: Array<{ name: string; Attendance: number }>;
  cgpa_distribution?: Array<{ name: string; value: number }>;
  placement_trend?: Array<{ name: string; Placements: number }>;
  recent_activities?: string[];
  latest_students: Array<{
    id: string;
    name: string;
    department: string;
    cgpa: number;
    attendance: number;
    placement_status: string;
  }>;
  alerts: Alert[];
}

import { getDashboard } from "../services/dashboardService";
import {
  addStudent,
  createInitialStudentForm,
  deleteStudent,
  getStudents,
  mapStudentToForm,
  StudentForm,
  updateStudent,
} from "../services/studentService";
import AIAssistant from "./AIAssistant";
import {
  getCareerRecommendation,
  getPlacementPrediction,
} from "../services/aiServices";
import TopHeader from "./shared/TopHeader";
import Profile from "./shared/Profile";
import SettingsComponent from "./shared/Settings";
import CalendarComponent from "./shared/Calendar";
import FileManagement from "./shared/FileManagement";
import HelpCenter from "./shared/HelpCenter";
import EmptyState from "./shared/EmptyState";
import LoadingState from "./shared/LoadingState";

interface AdminPortalProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  onLogout: () => void;
}

export default function AdminPortal({
  students,
  setStudents,
  alerts,
  setAlerts,
  onLogout,
}: AdminPortalProps) {
  // Sidebar State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedSem, setSelectedSem] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState<StudentForm>(
    createInitialStudentForm()
  );
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [studentActionError, setStudentActionError] = useState("");
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  // Placement
  const [targetRole, setTargetRole] = useState(
    "Software Development Engineer (SDE)"
  );
  const [customJobDesc, setCustomJobDesc] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [placementResults, setPlacementResults] = useState<Record<string, any>>({});
  const [viewingPredictionDetail, setViewingPredictionDetail] = useState<string | null>(null);

  // AI Chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiContext, setAiContext] = useState("Overall College Performance");

  // Profile
  const [admin, setAdmin] = useState<Admin>(adminProfile);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  // Report
  const [reportLoading, setReportLoading] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    loadStudents();
    loadDashboard();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboardData(response.data);
      const dashboardAlerts = (response.data.alerts || []).map((alert: Alert) => ({
        ...alert,
        status: alert.status || "active",
      }));
      setAlerts(dashboardAlerts);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshStudentData = async () => {
    await loadStudents();
    await loadDashboard();
  };

  const openAddStudentForm = () => {
    setEditingStudent(null);
    setStudentForm(createInitialStudentForm());
    setStudentActionError("");
    setIsStudentFormOpen(true);
  };

  const openEditStudentForm = (student: Student) => {
    setEditingStudent(student);
    setStudentForm(mapStudentToForm(student));
    setStudentActionError("");
    setIsStudentFormOpen(true);
  };

  const handleStudentFormChange = (
    field: keyof StudentForm,
    value: string | number
  ) => {
    setStudentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStudentFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingStudent(true);
    setStudentActionError("");

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentForm);
      } else {
        await addStudent(studentForm);
      }
      setIsStudentFormOpen(false);
      setEditingStudent(null);
      await refreshStudentData();
    } catch (err: any) {
      setStudentActionError(
        err?.response?.data?.detail || "Unable to save student record."
      );
    } finally {
      setIsSavingStudent(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeletingStudent(true);
    setStudentActionError("");
    try {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      if (selectedStudent?.id === studentToDelete.id) {
        setSelectedStudent(null);
      }
      await refreshStudentData();
    } catch (err: any) {
      setStudentActionError(
        err?.response?.data?.detail || "Unable to delete student record."
      );
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Stats
  const totalStudents = dashboardData?.students ?? students.length;

  const avgCgpa = dashboardData?.average_cgpa ?? parseFloat(
    (
      students.reduce((acc, curr) => acc + curr.cgpa, 0) /
      (students.length || 1)
    ).toFixed(2)
  );

  const avgAttendance = dashboardData?.average_attendance ?? parseFloat(
    (
      students.reduce(
        (acc, curr) => acc + curr.attendanceRate,
        0
      ) / (students.length || 1)
    ).toFixed(2)
  );

  const activeAlertsCount = alerts.filter(
    (a) => a.status === "active"
  ).length;

  const criticalAlertsCount = alerts.filter(
    (a) =>
      a.status === "active" &&
      a.severity === "critical"
  ).length;

  const depts = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];

  const deptData = depts.map((dept) => {
    const deptStudents = students.filter(
      (s) => s.department === dept
    );

    const count = deptStudents.length;

    const avgCG =
      count > 0
        ? parseFloat(
            (
              deptStudents.reduce(
                (a, b) => a + b.cgpa,
                0
              ) / count
            ).toFixed(2)
          )
        : 0;

    const avgAtt =
      count > 0
        ? parseFloat(
            (
              deptStudents.reduce(
                (a, b) => a + b.attendanceRate,
                0
              ) / count
            ).toFixed(1)
          )
        : 0;

    return {
      name: dept,
      Students: count,
      GPA: avgCG,
      Attendance: avgAtt,
    };
  });

  const dashboardDepartmentData = (dashboardData?.department_distribution || []).map((item) => ({
    name: item.name,
    Students: item.value,
    GPA: 0,
    Attendance: 0,
  }));

  const chartData = dashboardDepartmentData.length > 0 ? dashboardDepartmentData : deptData;

  const warningCount = students.filter(
    (s) =>
      s.earlyWarningAlert &&
      s.earlyWarningAlert.type !== "none"
  ).length;

  const filteredStudents = students.filter((student) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [
        student.name,
        student.rollNumber,
        student.id,
        student.department,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedQuery)
        );

    const matchesDept =
      selectedDept === "All" ||
      student.department === selectedDept;

    const matchesSem =
      selectedSem === "All" ||
      student.semester.toString() === selectedSem;

    return (
      matchesSearch &&
      matchesDept &&
      matchesSem
    );
  });

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev: Alert[]) =>
      prev.map((a: Alert) =>
        a.id === alertId
          ? {
              ...a,
              status: "resolved" as const,
            }
          : a
      )
    );
  };

  const handleGenerateStudentReport = async (
    student: Student
  ) => {
    setReportLoading(student.id);
    setGeneratedReport(null);

    try {
      const { data } = await getStudentReport({ student });
      setGeneratedReport(data.report);
    } catch (err) {
      console.error(err);
      setGeneratedReport(`### Academic Report\n\nName: ${student.name}\n\nCGPA: ${student.cgpa}\n\nAttendance: ${student.attendanceRate}%`);
    } finally {
      setReportLoading(null);
    }
  };

  // Action: Predict Placement via AI
  const handlePredictPlacement = async () => {
    setIsPredicting(true);
    const predictions: Record<string, any> = {};

    try {
      const targetStudents = selectedStudent
        ? [selectedStudent]
        : filteredStudents.slice(0, 4);

      for (const student of targetStudents) {
        const result = await getPlacementPrediction({
          student,
          targetJobRole: targetRole,
          jobDescription: customJobDesc,
        });
        predictions[student.id] = result.data.data;
      }
      setPlacementResults(predictions);
    } catch (err) {
      console.error("Placement Prediction Error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Action: Send Message in AI Assistant Chat
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: aiMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev: ChatMessage[]) => [...prev, userMsg]);
    setAiMessage("");
    setIsAiLoading(true);

    try {
      const contextData = {
        scope: aiContext,
        collegeStats: {
          totalStudents,
          averageCgpa: avgCgpa,
          averageAttendance: avgAttendance,
          activeAlerts: alerts.filter((a) => a.status === "active"),
          departmentAnalysis: deptData,
        },
        focusStudent: selectedStudent
          ? {
              name: selectedStudent.name,
              cgpa: selectedStudent.cgpa,
              attendance: selectedStudent.attendanceRate,
              skills: selectedStudent.technicalSkills,
              weaknesses: selectedStudent.weaknesses,
              subjects: selectedStudent.subjects,
            }
          : null,
      };

      const result = await getCareerRecommendation({
        message: userMsg.content,
        history: chatHistory,
        context: contextData,
      });

      const aiData = result.data.data;
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          aiData.final_advice ||
          aiData.career_path ||
          JSON.stringify(aiData, null, 2),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev: ChatMessage[]) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Unable to connect to AI Server.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev: ChatMessage[]) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Profile management submission
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileErrorMsg("");

    if (newPassword) {
      if (!oldPassword) {
        setProfileErrorMsg("Please enter your current password to modify credentials.");
        return;
      }
      if (newPassword.length < 6) {
        setProfileErrorMsg("New passkey must be at least 6 characters.");
        return;
      }
    }
    setProfileSuccessMsg("Profile and credentials updated successfully.");
    setNewPassword("");
    setOldPassword("");
  };

  const sidebarItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "students", icon: <Users size={20} />, label: "Students" },
    { id: "faculty", icon: <UserCog size={20} />, label: "Faculty" },
    { id: "departments", icon: <Building2 size={20} />, label: "Departments" },
    { id: "courses", icon: <BookOpen size={20} />, label: "Courses" },
    { id: "attendance", icon: <CalendarCheck size={20} />, label: "Attendance" },
    { id: "results", icon: <Award size={20} />, label: "Results & Analytics" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "placements", icon: <Briefcase size={20} />, label: "Placements" },
    { id: "notices", icon: <Bell size={20} />, label: "Notices" },
    { id: "fees", icon: <Receipt size={20} />, label: "Fees" },
    { id: "certificates", icon: <FileBadge size={20} />, label: "Certificates" },
    { id: "documents", icon: <FolderOpen size={20} />, label: "Documents" },
    { id: "ai", icon: <BrainCircuit size={20} />, label: "AI University Insights" },
    { id: "calendar", icon: <CalendarIcon size={20} />, label: "Calendar" },
    { id: "files", icon: <FileIcon size={20} />, label: "Files" },
    { id: "help", icon: <LifeBuoy size={20} />, label: "Help Center" },
    { id: "profile", icon: <UserCog size={20} />, label: "My Profile" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] flex flex-col md:flex-row overflow-hidden" id="admin-portal">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0 relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center">
            <Landmark size={18} color="white" />
          </div>
          <span className="font-bold text-[var(--text)]">EduMonitor Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[var(--text-2)] hover:text-[var(--primary)]">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
        fixed md:relative z-40 w-64 h-[calc(100vh-64px)] md:h-screen 
        bg-[var(--surface)] border-r border-[var(--border)] 
        transition-transform duration-300 ease-in-out shrink-0 flex flex-col
      `}>
        {/* Desktop Logo */}
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-[var(--border-light)] shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-orange)]">
            <Landmark size={22} color="white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-[var(--text)] tracking-tight block leading-none">EduMonitor</span>
            <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mt-1 block">Admin Command</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); if (item.id !== "results" && item.id !== "students") setSelectedStudent(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-orange)] translate-x-1"
                  : "text-[var(--text-2)] hover:bg-[var(--primary-pale)] hover:text-[var(--primary)]"
              }`}
            >
              <div className={`${activeTab === item.id ? "text-white" : "text-[var(--text-muted)]"}`}>
                {item.icon}
              </div>
              {item.label}
              {item.id === "notices" && <span className="ml-auto bg-[var(--warning)] text-[var(--surface)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>}
              {item.id === "ai" && <span className="ml-auto text-white text-[9px] font-bold"><Sparkles size={12}/></span>}
            </button>
          ))}
        </div>

        {/* Sidebar Footer User Area */}
        <div className="p-4 border-t border-[var(--border-light)] bg-[var(--surface-raised)] shrink-0">
          <div className="flex items-center gap-3 p-2">
            <img src={admin.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary-light)]" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0 flex flex-col text-left">
              <span className="text-sm font-bold text-[var(--text)] block truncate">{admin.name}</span>
              <span className="text-[10px] text-[var(--text-muted)] block truncate uppercase tracking-wider">Chief Administrator</span>
            </div>
            <button onClick={onLogout} className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden">
        
        <TopHeader 
          title={sidebarItems.find(i => i.id === activeTab)?.label || "Dashboard"} 
          role="admin" 
          extraElements={
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-pale)] px-3 py-1.5 rounded-full border border-[var(--border-orange)] tracking-widest uppercase shadow-sm">
                Admin Command
              </span>
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth pb-20 custom-scrollbar pt-6">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* 7. EduMonitor AI (Hero Section) */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[var(--radius)] shadow-[var(--shadow-orange)] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white border border-[var(--primary-light)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">EduMonitor AI Insight</span>
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3 leading-tight">Institution Health Score</h2>
                  <div className="space-y-2 text-sm font-medium text-white/90">
                    <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-white"/> Attendance dropped by 4% in Mechanical Dept.</p>
                    <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-white"/> {warningCount} students are currently at academic risk.</p>
                    <p className="flex items-center gap-2"><Target className="w-4 h-4 text-white"/> Upcoming placement season prep is on track.</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center mt-6 md:mt-0 shrink-0 border-l border-white/20 pl-8">
                  <div className="relative flex items-center justify-center w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="white" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * 92) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">92</span>
                      <span className="text-[10px] uppercase font-bold text-white/80">out of 100</span>
                    </div>
                  </div>
                </div>
                
                {/* Hero Quick Actions */}
                <div className="w-full md:w-auto relative z-10 mt-6 md:mt-0 flex flex-col gap-2 shrink-0 md:ml-8">
                  <button onClick={() => setActiveTab("ai")} className="bg-white text-[var(--primary)] text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer w-full flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Insights
                  </button>
                  <button className="bg-white/20 text-white border border-white/30 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/30 transition-colors cursor-pointer w-full flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" /> Risk Analysis
                  </button>
                  <button className="bg-white/20 text-white border border-white/30 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/30 transition-colors cursor-pointer w-full flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Generate Report
                  </button>
                </div>
              </div>

              {/* 1. Quick Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: totalStudents, icon: <Users size={20}/>, color: "var(--primary)" },
                  { label: "Faculty Members", value: dashboardData?.faculty ?? 145, icon: <UserCog size={20}/>, color: "var(--primary)" },
                  { label: "Departments", value: dashboardData?.departments ?? depts.length, icon: <Building2 size={20}/>, color: "var(--primary)" },
                  { label: "Active Courses", value: dashboardData?.courses ?? 82, icon: <BookOpen size={20}/>, color: "var(--primary)" },
                  { label: "Average Attendance", value: `${avgAttendance}%`, icon: <CalendarCheck size={20}/>, color: "var(--success)" },
                  { label: "Placement Rate", value: "88%", icon: <Briefcase size={20}/>, color: "var(--primary)" },
                  { label: "Fee Collection", value: "92%", icon: <Receipt size={20}/>, color: "var(--success)" },
                  { label: "Pending Approvals", value: "14", icon: <CheckCircle size={20}/>, color: "var(--warning)" },
                ].map((stat, i) => (
                  <Card key={i} className="hover:-translate-y-1 transition-transform duration-300 cursor-default hover:shadow-[var(--shadow-orange)] group relative overflow-hidden p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>{stat.icon}</div>
                    <div className="flex flex-col h-full justify-between">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-2xl font-black text-[var(--text)]">{stat.value}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 2. University Analytics & 8. Top Performing Departments */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* University Analytics Chart */}
                <Card className="lg:col-span-2 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">University Academic Analytics</h3>
                    <span className="text-[11px] font-bold text-[var(--text-muted)]">Department-wise Strength &amp; GPA</span>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                        <YAxis yAxisId="left" orientation="left" stroke="var(--primary)" fontSize={10} domain={[0, 10]} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--success)" fontSize={10} domain={[0, 100]} />
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }} />
                        <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                        <Bar yAxisId="left" dataKey="GPA" name="Average GPA" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={25} />
                        <Bar yAxisId="right" dataKey="Attendance" name="Attendance %" fill="var(--success)" radius={[4, 4, 0, 0]} barSize={25} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Top Performing Departments Leaderboard */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Top Departments</h3>
                  </div>
                  <div className="space-y-4 flex-1">
                    {chartData.sort((a,b) => b.GPA - a.GPA).slice(0,5).map((dept, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-pale)] text-[var(--primary)] flex items-center justify-center font-black text-xs shrink-0 border border-[var(--border-orange)]">
                          #{i+1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-bold text-[var(--text)] truncate">{dept.name}</h4>
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">GPA: {dept.GPA} • Att: {dept.Attendance}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* 3. Student Management (Preview), 6. Approvals, 9. Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 3. Student Management Preview */}
                <Card className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Recent Enrollments</h3>
                    <button onClick={() => setActiveTab("students")} className="text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer">View All Students</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                        <tr>
                          <th className="px-3 py-2 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Student</th>
                          <th className="px-3 py-2 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Dept</th>
                          <th className="px-3 py-2 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">CGPA</th>
                          <th className="px-3 py-2 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)] font-medium">
                        {(dashboardData?.latest_students || students.slice(0, 4)).map(student => (
                          <tr key={student.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                            <td className="px-3 py-2.5 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[var(--primary-pale)] border border-[var(--border-orange)] flex items-center justify-center text-[8px] font-bold text-[var(--primary)]">
                                {student.name.charAt(0)}
                              </div>
                              <span className="font-bold text-[var(--text)]">{student.name}</span>
                            </td>
                            <td className="px-3 py-2.5 text-[var(--text-2)] font-semibold">{student.department}</td>
                            <td className="px-3 py-2.5 font-bold text-[var(--text)]">{student.cgpa}</td>
                            <td className="px-3 py-2.5">
                              <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* 9. Alerts */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">System Alerts</h3>
                    <span className="bg-[var(--danger)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{activeAlertsCount} Alerts</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto max-h-48 custom-scrollbar">
                    {alerts.filter(a => a.status === "active").slice(0,4).map(alert => (
                      <div key={alert.id} className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-start gap-3 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${alert.severity === "critical" ? "bg-[var(--danger)]" : "bg-[var(--warning)]"}`}></div>
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alert.severity === "critical" ? "text-[var(--danger)]" : "text-[var(--warning)]"}`} />
                        <div className="flex-1 space-y-1 min-w-0">
                          <p className="text-[11px] text-[var(--text)] font-semibold leading-tight">{alert.message}</p>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase">{alert.department}</span>
                            <span className="text-[9px] text-[var(--text-muted)] font-mono">{alert.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {activeAlertsCount === 0 && <div className="text-[11px] text-[var(--text-muted)] text-center py-4">No active alerts. System healthy.</div>}
                  </div>
                </Card>
              </div>

              {/* 5. Today's Schedule & 13. Recent Activity & 14. Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 13. Recent Activity */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Recent Activity</h3>
                  </div>
                  <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border-light)] pb-2">
                    {[
                      { title: "Student Registered", desc: "Aisha Patel enrolled in CS", icon: <Users size={12}/>, color: "bg-[var(--primary)]" },
                      { title: "Result Published", desc: "Sem 5 marks finalized", icon: <Award size={12}/>, color: "bg-green-500" },
                      { title: "Fee Received", desc: "Txn #88921 processed", icon: <Receipt size={12}/>, color: "bg-blue-500" },
                      { title: "Placement Drive Created", desc: "Amazon SDE Drive", icon: <Briefcase size={12}/>, color: "bg-purple-500" },
                      { title: "Notice Published", desc: "Holiday on 15th Aug", icon: <Bell size={12}/>, color: "bg-[var(--warning)]" },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 relative z-10 text-white shadow-sm ${act.color}`}>
                          {act.icon}
                        </div>
                        <div className="pt-0.5 text-left">
                          <h4 className="text-[12px] font-bold text-[var(--text)] leading-tight">{act.title}</h4>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{act.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 6. Pending Approvals */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Pending Approvals</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: "Leave Request", name: "Prof. Alan Smith", dept: "CS Dept" },
                      { type: "Document Verification", name: "Rahul Sharma", dept: "Mech Dept" },
                      { type: "Scholarship", name: "Priya Desai", dept: "IT Dept" },
                    ].map((req, i) => (
                      <div key={i} className="p-3 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase text-[var(--primary)] tracking-wide">{req.type}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-semibold">{req.dept}</span>
                        </div>
                        <span className="text-[12px] font-bold text-[var(--text)]">{req.name}</span>
                        <div className="flex gap-2 mt-1">
                          <button className="flex-1 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded text-[10px] font-bold transition-colors cursor-pointer">Approve</button>
                          <button className="flex-1 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded text-[10px] font-bold transition-colors cursor-pointer">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 14. Quick Actions */}
                <Card className="flex flex-col space-y-4 bg-[var(--surface-raised)]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Add Student", icon: <Plus size={16}/>, action: () => { setActiveTab("students"); setTimeout(openAddStudentForm, 100); } },
                      { label: "Publish Notice", icon: <Bell size={16}/>, action: () => setActiveTab("notices") },
                      { label: "Manage Fees", icon: <Receipt size={16}/>, action: () => setActiveTab("fees") },
                      { label: "Create Drive", icon: <Briefcase size={16}/>, action: () => setActiveTab("placements") },
                      { label: "Add Faculty", icon: <UserCog size={16}/>, action: () => setActiveTab("faculty") },
                      { label: "Generate Report", icon: <FileText size={16}/>, action: () => setActiveTab("results") },
                    ].map((action, i) => (
                      <button 
                        key={i} 
                        onClick={action.action}
                        className="bg-[var(--surface)] hover:bg-[var(--primary-pale)] hover:border-[var(--border-orange)] hover:text-[var(--primary)] border border-[var(--border)] p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--text-2)] transition-all cursor-pointer shadow-sm"
                      >
                        {action.icon}
                        <span className="text-[10px] font-bold text-center leading-tight">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

            </div>
          )}

          {/* TAB 2: STUDENTS ROSTER (Existing logic preserved, UI revamped) */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Student Management</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Review student registries, query semester terms, and manage profiles.</p>
                </div>
                <button
                  onClick={openAddStudentForm}
                  className="btn-primary py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </button>
              </div>

              {/* Roster Controls */}
              <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, roll number, student ID, or department..."
                    className="w-full pl-10 pr-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs focus:outline-none focus:border-[var(--primary)] font-medium text-[var(--text)]"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[var(--text-2)] whitespace-nowrap uppercase">Dept:</span>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-2 text-[11px] font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Departments</option>
                      {depts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[var(--text-2)] whitespace-nowrap uppercase">Sem:</span>
                    <select
                      value={selectedSem}
                      onChange={(e) => setSelectedSem(e.target.value)}
                      className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-2 text-[11px] font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Semesters</option>
                      <option value="2">Semester 2</option>
                      <option value="4">Semester 4</option>
                      <option value="6">Semester 6</option>
                      <option value="8">Semester 8</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Roster Table */}
              <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Student</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Roll Number</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Department</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Semester</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">CGPA</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Attendance</th>
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 min-w-48">
                              <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-lg object-cover border border-[var(--border)] shadow-sm" referrerPolicy="no-referrer" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[var(--text)] text-[13px] leading-tight">{student.name}</span>
                                  {student.earlyWarningAlert && student.earlyWarningAlert.type !== "none" && (
                                    <span className="bg-red-50 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-200 uppercase tracking-widest">
                                      Alert
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono block mt-0.5">{student.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[12px] font-bold text-[var(--text-2)] font-mono">{student.rollNumber || "N/A"}</td>
                          <td className="px-4 py-3 text-[12px] font-bold text-[var(--text-2)]">{student.department}</td>
                          <td className="px-4 py-3 text-[12px] font-bold text-[var(--text-2)]">Semester {student.semester}</td>
                          <td className="px-4 py-3 text-[12px] font-black text-[var(--text)]">{student.cgpa}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[12px] font-black ${student.attendanceRate < 75 ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                              {student.attendanceRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setViewStudent(student)} className="p-1.5 rounded bg-[var(--bg)] hover:bg-[var(--border)] text-[var(--text-2)] transition-all cursor-pointer" title="View"><Eye size={14}/></button>
                              <button onClick={() => openEditStudentForm(student)} className="p-1.5 rounded bg-[var(--primary-pale)] hover:bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--border-orange)] transition-all cursor-pointer" title="Edit"><Pencil size={14}/></button>
                              <button onClick={() => setStudentToDelete(student)} className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-[var(--danger)] border border-red-100 transition-all cursor-pointer" title="Delete"><Trash2 size={14}/></button>
                              <button onClick={() => { setSelectedStudent(student); setActiveTab("results"); }} className="bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--border-light)] text-[var(--text)] font-bold text-[10px] py-1.5 px-2.5 rounded transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider">Profile</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-xs font-semibold text-[var(--text-muted)]">No students found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RESULTS & ANALYTICS (Formerly Skills & Semesters - Logic preserved, UI revamped) */}
          {activeTab === "results" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Results &amp; Analytics</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Review course marks, identify student weaknesses, inspect technical skills, and analyze performance.</p>
                </div>
                {selectedStudent && (
                  <button onClick={() => setSelectedStudent(null)} className="bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-raised)] text-[var(--text)] text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer">
                    &larr; Back to Roster
                  </button>
                )}
              </div>

              {!selectedStudent ? (
                <div className="bg-[var(--surface)] p-12 rounded-2xl border border-[var(--border)] text-center space-y-4 shadow-sm">
                  <Award className="w-12 h-12 text-[var(--text-muted)] opacity-50 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-[var(--text)] text-[15px]">Select a Student for Academic Profile Audit</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">You must choose a student from the Enrollment Register to explore subject-wise marks, weaknesses, and skill maps.</p>
                  </div>
                  <button onClick={() => setActiveTab("students")} className="btn-primary text-xs px-5 py-2.5 cursor-pointer mt-2 inline-flex">
                    View Roster Register
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Student Left Sidebar: Profile overview */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="text-center space-y-4 border-[var(--border-orange)] bg-gradient-to-b from-[var(--surface)] to-[var(--primary-pale)]">
                      <img src={selectedStudent.photoUrl} alt="" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-[var(--shadow-orange)] mx-auto" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text)] leading-tight">{selectedStudent.name}</h3>
                        <span className="text-[11px] font-bold text-[var(--text-muted)] font-mono block mt-1">{selectedStudent.id}</span>
                        <span className="bg-white text-[var(--text-2)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border)] mt-3 inline-block shadow-sm">
                          {selectedStudent.department} • Semester {selectedStudent.semester}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-left pt-5 border-t border-[var(--border)]/60">
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Overall CGPA</span>
                          <span className="text-lg font-black text-[var(--text)]">{selectedStudent.cgpa}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Attendance</span>
                          <span className={`text-lg font-black ${selectedStudent.attendanceRate < 75 ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>{selectedStudent.attendanceRate}%</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => handleGenerateStudentReport(selectedStudent)}
                          disabled={reportLoading === selectedStudent.id}
                          className="w-full bg-[var(--text)] hover:bg-black text-[var(--bg)] text-[12px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                          {reportLoading === selectedStudent.id ? "Analyzing records..." : "Generate AI Audit Report"}
                        </button>
                      </div>
                    </Card>

                    <Card className="space-y-4">
                      <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight border-b border-[var(--border-light)] pb-2">Skills Profiler</h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2">Technical Skill Set</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedStudent.technicalSkills || []).map(skill => (
                              <span key={skill} className="bg-[var(--primary-pale)] text-[var(--primary)] text-[11px] font-bold px-2.5 py-1 rounded-md border border-[var(--border-orange)]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2">Professional Soft Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedStudent.softSkills || []).map(skill => (
                              <span key={skill} className="bg-[var(--surface-raised)] text-[var(--text-2)] text-[11px] font-bold px-2.5 py-1 rounded-md border border-[var(--border)]">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2">Extracurricular Passions</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(selectedStudent.extracurriculars || []).map(ex => (
                              <span key={ex} className="bg-[var(--bg)] text-[var(--text-muted)] text-[11px] font-bold px-2.5 py-1 rounded-md border border-[var(--border-light)]">
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Student Center/Right Content */}
                  <div className="lg:col-span-8 space-y-6">
                    <Card className="space-y-4">
                      <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Current Coursework Grades</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[var(--bg)]">
                            <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase font-bold text-[10px]">
                              <th className="px-3 py-2">Course Code &amp; Name</th>
                              <th className="px-3 py-2">Course Marks</th>
                              <th className="px-3 py-2 text-center">Class Status</th>
                              <th className="px-3 py-2">Assigned Lecturer</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-light)] font-medium">
                            {(selectedStudent.subjects || []).map(sub => (
                              <tr key={sub.code} className="hover:bg-[var(--surface-raised)] transition-colors">
                                <td className="px-3 py-3">
                                  <span className="font-bold text-[var(--text)] block text-[12px]">{sub.name}</span>
                                  <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">{sub.code}</span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className="font-black text-[var(--text)] text-[13px]">{sub.marks}</span>
                                  <span className="text-[var(--text-muted)] text-[10px] font-bold"> / {sub.maxMarks}</span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span className={`px-2.5 py-1 rounded-md font-bold text-[9px] uppercase tracking-wider border ${
                                    sub.marks >= 85 ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20" : 
                                    sub.marks >= 60 ? "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20" : 
                                    "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20"
                                  }`}>
                                    {sub.marks >= 85 ? "Excellent" : sub.marks >= 60 ? "Proficient" : "Critical Gap"}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-[var(--text-2)] text-[11px] font-bold">{sub.facultyName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-2xl border border-green-200 space-y-3">
                        <h4 className="font-bold text-green-900 text-[11px] uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" /> Key Strengths
                        </h4>
                        <ul className="space-y-2">
                          {(selectedStudent.strengths || []).map((s, idx) => (
                            <li key={idx} className="text-[12px] text-green-800 font-bold flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 p-5 rounded-2xl border border-red-200 space-y-3">
                        <h4 className="font-bold text-red-900 text-[11px] uppercase tracking-wider flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-red-600" /> Improvement Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {(selectedStudent.weaknesses || []).map((w, idx) => (
                            <li key={idx} className="text-[12px] text-red-800 font-bold flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {generatedReport && (
                      <div className="bg-[var(--text)] text-[var(--bg)] p-6 rounded-2xl border border-black space-y-4 shadow-[var(--shadow)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-20 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex justify-between items-center border-b border-slate-700 pb-4 relative z-10">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                            <h3 className="font-bold text-[14px] tracking-tight uppercase">AI Auditor Report Summary</h3>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--primary)] font-bold">Gemini-1.5-flash Analytical Report</span>
                        </div>
                        <div className="text-[12px] font-medium space-y-4 leading-relaxed whitespace-pre-line overflow-y-auto max-h-96 pr-2 relative z-10 custom-scrollbar text-slate-300">
                          {generatedReport}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: PLACEMENTS (Existing Placement Predictor - Logic preserved, UI revamped) */}
          {activeTab === "placements" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Placement Predictor Analyzer</h1>
                  <p className="text-[12px] text-[var(--text-muted)] mt-1 font-medium">Simulate corporate hiring compatibility and analyze skills gaps against real industry roles.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--primary-pale)] text-[var(--primary)] text-[11px] font-bold px-4 py-2 rounded-full border border-[var(--border-orange)] flex items-center gap-1.5 shadow-sm">
                    <Briefcase size={14}/> Corporate Hiring Suite
                  </span>
                </div>
              </div>

              {/* Placement Control Parameters */}
              <Card className="space-y-6 bg-gradient-to-r from-[var(--surface)] to-[var(--bg)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--text-2)] uppercase tracking-wide">Target Job Profile / Role</label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-bold focus:border-[var(--primary)] focus:outline-none cursor-pointer text-[var(--text)] shadow-sm"
                    >
                      <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="UX Researcher & Designer">UX Researcher &amp; Designer</option>
                      <option value="Cloud/DevOps Engineer">Cloud/DevOps Engineer</option>
                      <option value="Robotics/Mechatronics Engineer">Robotics/Mechatronics Engineer</option>
                      <option value="BIM Modeler / Structural Designer">BIM Modeler / Structural Designer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[var(--text-2)] uppercase tracking-wide">Optional Custom Job Description</label>
                    <input
                      type="text"
                      value={customJobDesc}
                      onChange={(e) => setCustomJobDesc(e.target.value)}
                      placeholder="e.g. 'Must know AWS, React, Python and have GPA > 7.5'..."
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)] shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-[11px] text-[var(--text-muted)] font-bold bg-[var(--bg)] px-3 py-1.5 rounded-md border border-[var(--border-light)]">
                    {selectedStudent 
                      ? `Running simulator exclusively for: ${selectedStudent.name}`
                      : `Running simulator for current filtered cohort of ${filteredStudents.length} students.`
                    }
                  </div>
                  <button
                    onClick={handlePredictPlacement}
                    disabled={isPredicting || filteredStudents.length === 0}
                    className="btn-primary py-3 px-6 text-[13px] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <BrainCircuit size={16} />
                    {isPredicting ? "Predicting Qualifications..." : "Simulate Hiring Suitability"}
                  </button>
                </div>
              </Card>

              {/* Predictions Display Matrix */}
              <div className="space-y-4">
                <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Eligibility Forecast Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(selectedStudent ? [selectedStudent] : filteredStudents).map(student => {
                    const defaultPred = student.placementPredictions.find(p => p.role === targetRole) || student.placementPredictions[0];
                    const aiReport = placementResults[student.id];

                    return (
                      <Card key={student.id} className="space-y-5">
                        <div className="flex justify-between items-start border-b border-[var(--border-light)] pb-4">
                          <div className="flex items-center gap-3">
                            <img src={student.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shadow-sm" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="font-bold text-[var(--text)] text-[14px] leading-tight">{student.name}</h4>
                              <span className="text-[11px] font-bold text-[var(--text-muted)]">{student.department} • CGPA: {student.cgpa}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-1 rounded-md font-bold text-[9px] uppercase tracking-widest border ${
                              student.cgpa >= 7.5 && student.attendanceRate >= 75
                                ? "bg-green-50 text-green-700 border-green-200"
                                : student.cgpa >= 7.0
                                ? "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                              {student.cgpa >= 7.5 && student.attendanceRate >= 75 ? "Directly Eligible" : "Academic Boundary"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)] space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-[var(--text-2)]">{targetRole} Matching Index</span>
                            <span className="text-[16px] font-black text-[var(--primary)]">{defaultPred?.probability || 75}% Fit</span>
                          </div>
                          <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
                            <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: `${defaultPred?.probability || 75}%` }}></div>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] italic font-medium leading-relaxed">
                            &ldquo;{defaultPred?.reason || "Review skills profile for custom recruitment evaluation."}&rdquo;
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[9px] text-[var(--danger)] uppercase font-bold block mb-2 tracking-wider">Target Skills Gap</span>
                            <div className="flex flex-wrap gap-1.5">
                              {defaultPred?.missingSkills.map(skill => (
                                <span key={skill} className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-[var(--primary)] uppercase font-bold block mb-2 tracking-wider">Suggested Roadmap</span>
                            <div className="flex flex-wrap gap-1.5">
                              {defaultPred?.recommendedCertifications.map(cert => (
                                <span key={cert} className="bg-[var(--primary-pale)] text-[var(--primary)] text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--border-orange)] truncate max-w-full">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {aiReport && (
                          <div className="pt-4 border-t border-[var(--border-light)]">
                            <button
                              onClick={() => setViewingPredictionDetail(viewingPredictionDetail === student.id ? null : student.id)}
                              className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles size={14} />
                              {viewingPredictionDetail === student.id ? "Hide Detailed AI Predictions Report" : "Read Detailed AI Predictions Report"}
                            </button>
                            {viewingPredictionDetail === student.id && (
                              <div className="mt-3 p-5 bg-[var(--text)] text-[var(--bg)] rounded-xl text-[12px] font-medium space-y-2 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto custom-scrollbar shadow-inner">
                                {aiReport}
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: AI UNIVERSITY INSIGHTS (Existing AI Coach - Logic preserved, UI revamped) */}
          {activeTab === "ai" && (
            <div className="space-y-6 animate-fade-in h-[calc(100vh-10rem)] flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">AI University Insights &amp; Remedial Coach</h1>
                <p className="text-[12px] text-[var(--text-muted)] mt-1 font-medium">Converse directly with the administrative knowledge agent to identify grade bottlenecks, compose remedial plans, or generate reports.</p>
              </div>

              {/* Chat Viewport Grid */}
              <div className="flex-1 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)] flex overflow-hidden min-h-0">
                {/* Chat Left Menu */}
                <div className="w-1/3 border-r border-[var(--border)] p-5 space-y-6 overflow-y-auto hidden md:block bg-[var(--bg)]">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Context Scope Config</span>
                    <select 
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-[12px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)] shadow-sm cursor-pointer"
                    >
                      <option value="Overall College Performance">Overall College Performance</option>
                      <option value="Early-Warning & At-Risk Students">Early-Warning &amp; At-Risk Students</option>
                      <option value="Placement Eligibility Reports">Placement Eligibility Reports</option>
                      {selectedStudent && <option value={`Student: ${selectedStudent.name}`}>Student: {selectedStudent.name}</option>}
                    </select>
                  </div>

                  <div className="pt-5 border-t border-[var(--border-light)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-3">Prompt Templates</span>
                    <div className="space-y-2">
                      <button onClick={() => setAiMessage("Identify the students who need urgent help in Math/Structural classes and write a custom email draft to their counselors.")} className="w-full text-left text-[11px] bg-[var(--surface)] hover:bg-[var(--primary-pale)] hover:border-[var(--border-orange)] hover:text-[var(--primary)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-2)] font-bold transition-all cursor-pointer shadow-sm">
                        &ldquo;Who needs urgent help?&rdquo;
                      </button>
                      <button onClick={() => setAiMessage("Who are the top candidates for a Java/Full-Stack Software Engineer job in the CS/IT department? Format as a table.")} className="w-full text-left text-[11px] bg-[var(--surface)] hover:bg-[var(--primary-pale)] hover:border-[var(--border-orange)] hover:text-[var(--primary)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-2)] font-bold transition-all cursor-pointer shadow-sm">
                        &ldquo;Find top Java SDE candidates&rdquo;
                      </button>
                      <button onClick={() => setAiMessage("Analyze the GPA drop across semesters. Which departments are experiencing a drop, and why?")} className="w-full text-left text-[11px] bg-[var(--surface)] hover:bg-[var(--primary-pale)] hover:border-[var(--border-orange)] hover:text-[var(--primary)] border border-[var(--border)] rounded-xl p-3 text-[var(--text-2)] font-bold transition-all cursor-pointer shadow-sm">
                        &ldquo;Analyze semester GPA trends&rdquo;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[var(--surface)] relative">
                  <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-5 relative z-10 custom-scrollbar">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-[var(--primary-pale)] border border-[var(--border-orange)] rounded-2xl flex items-center justify-center">
                          <BrainCircuit className="w-8 h-8 text-[var(--primary)]" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-[var(--text)] text-[16px]">EduMonitor Assistant Console</h4>
                          <p className="text-[12px] text-[var(--text-muted)] font-medium leading-relaxed">
                            I can analyze marks data, parse early-warning alerts, recommend study roadmaps, or draft notices. Choose a prompt template on the left or enter your query below.
                          </p>
                        </div>
                      </div>
                    ) : (
                      chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                          <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shadow-sm border ${
                            msg.role === "user" ? "bg-[var(--text)] text-[var(--bg)] border-black" : "bg-[var(--primary)] text-white border-[var(--primary-dark)]"
                          }`}>
                            {msg.role === "user" ? "U" : "AI"}
                          </div>
                          
                          <div className={`p-4 rounded-2xl text-[12.5px] font-medium leading-relaxed space-y-2 whitespace-pre-line shadow-sm border ${
                            msg.role === "user" 
                              ? "bg-[var(--text)] text-[var(--bg)] border-black rounded-tr-none" 
                              : "bg-[var(--bg)] border-[var(--border)] text-[var(--text)] rounded-tl-none"
                          }`}>
                            <div>{msg.content}</div>
                            <span className={`block text-[9px] text-right mt-2 font-bold ${msg.role === "user" ? "text-gray-400" : "text-[var(--text-muted)]"}`}>{msg.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                    {isAiLoading && (
                      <div className="flex gap-3 max-w-[85%] mr-auto">
                        <div className="shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-sm border border-[var(--primary-dark)]">AI</div>
                        <div className="bg-[var(--bg)] border border-[var(--border)] text-[var(--text-2)] p-4 rounded-2xl rounded-tl-none text-[12px] font-bold flex items-center gap-3 shadow-sm">
                          <RefreshCw className="w-4 h-4 animate-spin text-[var(--primary)]" />
                          <span>Gemini is compiling analytical reports...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendAiMessage} className="p-5 border-t border-[var(--border)] flex gap-3 bg-[var(--surface)] relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                    <input
                      type="text"
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      placeholder="Type your academic analysis question..."
                      className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-5 py-3 text-[13px] font-medium focus:outline-none focus:border-[var(--primary)] text-[var(--text)] shadow-inner"
                    />
                    <button type="submit" className="btn-primary w-14 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI UNIVERSITY INSIGHTS */}
          {activeTab === "ai" && (
            <div className="animate-fade-in text-left h-[calc(100vh-8rem)]">
              <AIAssistant role="admin" context={{ admin, dashboardData }} />
            </div>
          )}

          {/* VIEW: SHARED COMPONENTS */}
          {activeTab === "profile" && <Profile role="admin" data={admin} />}
          {activeTab === "settings" && <SettingsComponent />}
          {activeTab === "calendar" && <CalendarComponent />}
          {activeTab === "files" && <FileManagement role="admin" />}
          {activeTab === "help" && <HelpCenter />}

          {/* OTHER TABS (Placeholders for remaining requested tabs to show readiness) */}
          {!["dashboard", "students", "results", "placements", "ai", "profile", "settings", "calendar", "files", "help"].includes(activeTab) && (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
              <Card className="h-full min-h-[400px] w-full max-w-md mx-auto">
                <EmptyState 
                  icon={sidebarItems.find(i => i.id === activeTab)?.icon}
                  title={`${sidebarItems.find(i => i.id === activeTab)?.label} Module`}
                  message="The frontend architecture for this module is fully prepared and integrated into the global design system. Waiting for backend API endpoints to populate real-time data."
                />
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* Reused Student Form Modal (Logic identical, UI updated) */}
      {isStudentFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border)]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--border)] bg-[var(--bg)]">
              <h2 className="text-[16px] font-bold text-[var(--text)] flex items-center gap-2">
                {editingStudent ? <Pencil className="w-4 h-4 text-[var(--primary)]"/> : <Plus className="w-4 h-4 text-[var(--primary)]"/>}
                {editingStudent ? "Edit Student Profile" : "Register New Student"}
              </h2>
              <button onClick={() => setIsStudentFormOpen(false)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {studentActionError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-[12px] font-bold rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle size={16}/> {studentActionError}
                </div>
              )}
              
              <form id="student-form" onSubmit={handleStudentFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Full Legal Name *</label>
                    <input required type="text" value={studentForm.name} onChange={(e) => handleStudentFormChange("name", e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Email Address *</label>
                    <input required type="email" value={studentForm.email} onChange={(e) => handleStudentFormChange("email", e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" placeholder="john@university.edu" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Roll Number *</label>
                    <input required type="text" value={studentForm.roll_no} onChange={(e) => handleStudentFormChange("roll_no", e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" placeholder="CS2021001" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Department *</label>
                    <select value={studentForm.department} onChange={(e) => handleStudentFormChange("department", e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]">
                      {depts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Current Semester</label>
                    <input type="number" min="1" max="8" value={studentForm.semester} onChange={(e) => handleStudentFormChange("semester", parseInt(e.target.value))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">CGPA</label>
                    <input type="number" step="0.01" min="0" max="10" value={studentForm.cgpa} onChange={(e) => handleStudentFormChange("cgpa", parseFloat(e.target.value))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-3">
              <button onClick={() => setIsStudentFormOpen(false)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-raised)] transition-all cursor-pointer">
                Cancel
              </button>
              <button form="student-form" type="submit" disabled={isSavingStudent} className="btn-primary px-6 py-2.5 text-[12px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-w-32">
                {isSavingStudent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSavingStudent ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
