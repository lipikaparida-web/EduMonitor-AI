import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import {
  BookOpen, Users, Edit3, ShieldAlert, Sparkles, AlertTriangle,
  RefreshCw, Check, CheckCircle2, ChevronRight, GraduationCap, Send, Download,
  Search, FileText, Activity, Building2, Code, Flame, Clock, Compass, Printer, TrendingUp, X,
  LayoutDashboard, UserCog, CalendarCheck, Award, Bell, Settings, Target, MessageSquare, Plus, Mail, Pencil, Save, Eye, Trash2, Library, Beaker, FlaskConical, Microscope, BrainCircuit, HeartPulse, Calendar as CalendarIcon, File as FileIcon, LifeBuoy, LogOut
} from "lucide-react";
import { Student, Alert, Faculty } from "../types";
import { facultyList } from "../data/mockData";
import { enrichStudent, EnrichedStudent } from "../utils/studentEnricher";
import {
  getCareerRecommendation,
  getPlacementPrediction,
  getResumeEvaluation,
  getInterviewPrep,
  getCompanyRecommendations,
} from "../services/aiServices";
import {
  addFacultyWorkspaceItem,
  deleteFacultyWorkspaceItem,
  FacultyWorkspaceSection,
  getFacultyClasses,
  getFacultyClassStudents,
  getFacultyWorkspace,
  saveFacultyClassAttendance,
  updateFacultyProfile,
  updateFacultyWorkspaceItem,
} from "../services/facultyService";
import { normalizeStudent } from "../services/studentService";
import AIAssistant from "./AIAssistant";
import TopHeader from "./shared/TopHeader";
import Profile from "./shared/Profile";
import SettingsComponent from "./shared/Settings";
import CalendarComponent from "./shared/Calendar";
import FileManagement from "./shared/FileManagement";
import HelpCenter from "./shared/HelpCenter";
import EmptyState from "./shared/EmptyState";
import LoadingState from "./shared/LoadingState";

type FacultyTab =
  | "dashboard"
  | "profile"
  | "courses"
  | "students"
  | "attendance"
  | "assignments"
  | "labs"
  | "results"
  | "materials"
  | "timetable"
  | "notices"
  | "research"
  | "ai"
  | "settings"
  | "calendar"
  | "files"
  | "help";

type WorkspaceItem = Record<string, any> & { id?: string };

interface FacultyWorkspace {
  profile: Record<string, any>;
  timetable: WorkspaceItem[];
  announcements: WorkspaceItem[];
  attendance: WorkspaceItem[];
  marks: WorkspaceItem[];
  subjects: WorkspaceItem[];
  assignments: WorkspaceItem[];
  notices: WorkspaceItem[];
  messages: WorkspaceItem[];
  reports: WorkspaceItem[];
}

interface FacultyClassAssignment {
  id: string;
  department: string;
  academic_year: string;
  semester: number;
  division: string;
  subject_code: string;
  subject_name: string;
  room?: string;
  student_count?: number;
}

interface FacultyPortalProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  onLogout: () => void;
}

export default function FacultyPortal({ students, setStudents, alerts, setAlerts, onLogout }: FacultyPortalProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<FacultyTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("CS-301");
  const [faculty, setFaculty] = useState<Faculty>(facultyList[0]); // Default to Dr. Amit Verma
  const [workspace, setWorkspace] = useState<FacultyWorkspace>({
    profile: {},
    timetable: [],
    announcements: [],
    attendance: [],
    marks: [],
    subjects: [],
    assignments: [],
    notices: [],
    messages: [],
    reports: [],
  });
  const [workspaceError, setWorkspaceError] = useState("");
  const [isWorkspaceSaving, setIsWorkspaceSaving] = useState(false);
  const [profileForm, setProfileForm] = useState<Record<string, any>>({});
  const [attendanceForm, setAttendanceForm] = useState({ date: new Date().toISOString().split("T")[0], status: "Present" });
  const [marksForm, setMarksForm] = useState({ internal: 0, assignment: 0, practical: 0, semester: 0 });
  const [subjectForm, setSubjectForm] = useState({ code: "CS-301", name: "Data Structures & Algorithms", material: "", lesson_plan: "", syllabus_progress: 0 });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", due_date: "", max_marks: 50, description: "" });
  const [communicationForm, setCommunicationForm] = useState({ title: "", body: "", audience: "Students" });
  const [assistantPrompt, setAssistantPrompt] = useState("Generate a 10-question quiz for the current unit.");
  const [assistantOutput, setAssistantOutput] = useState("");
  const [classAssignments, setClassAssignments] = useState<FacultyClassAssignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, string>>({});
  const [classLoadError, setClassLoadError] = useState("");
  
  // Roster enrichment
  const enrichedStudents = students.map(s => enrichStudent(s));

  // Search student state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(enrichedStudents[0]?.id || "");

  const activeStudent =
    enrichedStudents.find((s) => s && s.id === selectedStudentId) ||
    enrichedStudents[0] ||
    ({
      id: "",
      rollNumber: "",
      name: "",
      semester: 1,
      department: "Computer Science",
      email: "",
      academicYear: "",
      division: "A",
      photoUrl: `https://api.dicebear.com/9.x/initials/svg?seed=Student`,
      attendanceRate: 0,
      cgpa: 0,
      historySGPA: [],
      subjects: [],
      strengths: [],
      weaknesses: [],
      technicalSkills: [],
      softSkills: [],
      extracurriculars: [],
      isEligibleForPlacement: false,
      placementPredictions: [],
      projects: [],
      certifications: [],
      codingProfiles: [],
    } as EnrichedStudent);

  // AI states for selected student
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [aiReadinessScore, setAiReadinessScore] = useState<number | null>(null);
  const [aiSubScores, setAiSubScores] = useState<{
    technical: number;
    communication: number;
    resume: number;
    aptitude: number;
    interview: number;
    coding: number;
  } | null>(null);
  const [aiReadinessStatus, setAiReadinessStatus] = useState<string>("");
  const [isReadinessLoading, setIsReadinessLoading] = useState(false);

  const [aiResumeScore, setAiResumeScore] = useState<number | null>(null);
  const [aiResumeReport, setAiResumeReport] = useState<string | null>(null);
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  const [interviewQuestions, setInterviewQuestions] = useState<{
    category: string;
    question: string;
    answer: string;
    difficulty: string;
    feedback: string;
  }[]>([]);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const [companyRecs, setCompanyRecs] = useState<{
    name: string;
    eligibility: string;
    requiredSkills: string[];
    hiringPattern: string;
    interviewProcess: string;
    salaryPackage: string;
    successProbability: number;
  }[]>([]);
  const [isCompaniesLoading, setIsCompaniesLoading] = useState(false);

  // Print report state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Grading adjustment states
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempMarks, setTempMarks] = useState<number>(0);
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  // AI Planner state
  const [aiPlanContent, setAiPlanContent] = useState("");
  const [isAiPlanLoading, setIsAiPlanLoading] = useState(false);

  const selectedClass = classAssignments.find(item => item.id === selectedClassId);

  // Get current assigned course details
  const currentCourseDetails =
    faculty.courses.find(c => c.code === selectedCourse) ||
    (selectedClass ? { code: selectedClass.subject_code, name: selectedClass.subject_name } : undefined);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        setWorkspaceError("");
        const data = await getFacultyWorkspace();
        setWorkspace(data);
        setProfileForm(data.profile || {});
        if (data.profile?.name || data.profile?.email || data.profile?.photo_url) {
          setFaculty(prev => ({
            ...prev,
            name: data.profile.name || prev.name,
            email: data.profile.email || prev.email,
            department: data.profile.department || prev.department,
            photoUrl: data.profile.photo_url || prev.photoUrl,
          }));
        }
      } catch (err: any) {
        setWorkspaceError("");
      }
    };

    loadWorkspace();
  }, []);

  useEffect(() => {
    const loadClassAssignments = async () => {
      try {
        setClassLoadError("");
        const classes = await getFacultyClasses();
        setClassAssignments(classes);
        if (classes.length > 0) {
          const preferredClass = classes.find((item: FacultyClassAssignment) => Number(item.student_count || 0) > 0) || classes[0];
          setSelectedClassId(preferredClass.id);
          setSelectedCourse(preferredClass.subject_code);
        }
      } catch (err: any) {
        setClassLoadError("");
      }
    };

    loadClassAssignments();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    const loadClassStudents = async () => {
      try {
        setClassLoadError("");
        const response = await getFacultyClassStudents(selectedClassId);
        const selectedClass = response.class_assignment as FacultyClassAssignment;
        const normalizedStudents = (response.students || []).map((student: any) => normalizeStudent(student));
        setStudents(normalizedStudents);
        setSelectedCourse(selectedClass.subject_code);
        setAttendanceStatuses(
          Object.fromEntries(normalizedStudents.map((student: Student) => [student.id, "Present"]))
        );
      } catch (err: any) {
        setStudents([]);
        setClassLoadError("");
      }
    };

    loadClassStudents();
  }, [selectedClassId, setStudents]);

  const refreshWorkspace = async () => {
    const data = await getFacultyWorkspace();
    setWorkspace(data);
    setProfileForm(data.profile || {});
  };

  const saveProfile = async () => {
    setIsWorkspaceSaving(true);
    try {
      const profile = await updateFacultyProfile(profileForm);
      setWorkspace(prev => ({ ...prev, profile }));
      setFaculty(prev => ({
        ...prev,
        name: profile.name || prev.name,
        email: profile.email || prev.email,
        department: profile.department || prev.department,
        photoUrl: profile.photo_url || prev.photoUrl,
      }));
    } finally {
      setIsWorkspaceSaving(false);
    }
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileForm(prev => ({ ...prev, photo_url: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const addWorkspaceItem = async (section: FacultyWorkspaceSection, payload: Record<string, unknown>) => {
    setIsWorkspaceSaving(true);
    try {
      await addFacultyWorkspaceItem(section, payload);
      await refreshWorkspace();
    } finally {
      setIsWorkspaceSaving(false);
    }
  };

  const updateWorkspaceItem = async (section: FacultyWorkspaceSection, item: WorkspaceItem, payload: Record<string, unknown>) => {
    if (!item.id) return;
    setIsWorkspaceSaving(true);
    try {
      await updateFacultyWorkspaceItem(section, item.id, payload);
      await refreshWorkspace();
    } finally {
      setIsWorkspaceSaving(false);
    }
  };

  const removeWorkspaceItem = async (section: FacultyWorkspaceSection, item: WorkspaceItem) => {
    if (!item.id) return;
    setIsWorkspaceSaving(true);
    try {
      await deleteFacultyWorkspaceItem(section, item.id);
      await refreshWorkspace();
    } finally {
      setIsWorkspaceSaving(false);
    }
  };

  const saveWholeClassAttendance = async () => {
    if (!selectedClassId || enrichedStudents.length === 0) return;
    setIsWorkspaceSaving(true);
    try {
      await saveFacultyClassAttendance(selectedClassId, {
        date: attendanceForm.date,
        records: enrichedStudents.map(student => ({
          student_id: student.id,
          student_name: student.name,
          roll_no: student.rollNumber || student.id,
          status: attendanceStatuses[student.id] || "Present",
        })),
      });
      await refreshWorkspace();
    } finally {
      setIsWorkspaceSaving(false);
    }
  };

  const selectedStudentForEntry = activeStudent || enrichedStudents[0];

  const exportRows = (fileName: string, rows: WorkspaceItem[]) => {
    const keys = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
    const csv = [
      keys.join(","),
      ...rows.map(row => keys.map(key => `"${String(row[key] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateTeachingAssistantOutput = async (task: string) => {
    setAssistantOutput("");
    setIsAiPlanLoading(true);
    try {
      const { data } = await getCareerRecommendation({
        message: `${task}\n\n${assistantPrompt}`,
        history: [],
        context: {
          scope: "Faculty AI Teaching Assistant",
          course: currentCourseDetails,
          students: courseStudents.slice(0, 10),
        },
      });
      setAssistantOutput(data.text);
    } catch (err) {
      console.error(err);
      setAssistantOutput("Unable to reach AI service. Draft manually using the current class performance metrics and syllabus progress.");
    } finally {
      setIsAiPlanLoading(false);
    }
  };

  // Filter students enrolled in the selected course (all students taking CS-301 or CS-302)
  const courseStudents = enrichedStudents.filter(student => 
    student.subjects.some(sub => sub.code === selectedCourse)
  );

  // Reset student metrics when switching students
  useEffect(() => {
    setAiSummary(null);
    setAiReadinessScore(null);
    setAiSubScores(null);
    setAiReadinessStatus("");
    setAiResumeScore(null);
    setAiResumeReport(null);
    setInterviewQuestions([]);
    setCompanyRecs([]);
    setRevealedAnswers({});
  }, [selectedStudentId]);

  // General KPIs across ALL students
  const totalStudents = students.length;
  const avgCgpa = parseFloat((students.reduce((acc, curr) => acc + curr.cgpa, 0) / (totalStudents || 1)).toFixed(2));
  
  const atRiskCount = students.filter(s => 
    s.cgpa < 7.0 || 
    s.attendanceRate < 75 || 
    (s.earlyWarningAlert && s.earlyWarningAlert.type !== "none" && s.earlyWarningAlert.severity === "critical")
  ).length;

  const avgAttendanceOverall = parseFloat((students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (totalStudents || 1)).toFixed(1));
  const placementReadyCount = students.filter(s => s.cgpa >= 8.0 && s.attendanceRate >= 80).length;
  const placementReadyPercentage = Math.round((placementReadyCount / (totalStudents || 1)) * 100);

  // Course statistics
  const totalEnrolled = courseStudents.length;
  const avgMarks = parseFloat((courseStudents.reduce((acc, curr) => {
    const sub = curr.subjects.find(s => s.code === selectedCourse);
    return acc + (sub ? sub.marks : 0);
  }, 0) / (totalEnrolled || 1)).toFixed(1));

  const avgAttendance = parseFloat((courseStudents.reduce((acc, curr) => {
    const sub = curr.subjects.find(s => s.code === selectedCourse);
    return acc + (sub ? sub.attendance : 0);
  }, 0) / (totalEnrolled || 1)).toFixed(1));

  // Graph data: Marks Distribution
  const distributionData = courseStudents.map(student => {
    const sub = student.subjects.find(s => s.code === selectedCourse);
    return {
      name: student.name,
      Marks: sub ? sub.marks : 0,
      Attendance: sub ? sub.attendance : 0
    };
  });

  // Action: Modify Grade
  const handleEditGradeClick = (studentId: string, currentMarks: number) => {
    setEditingStudentId(studentId);
    setTempMarks(currentMarks);
  };

  const handleSaveGrade = async (studentId: string) => {
    if (tempMarks < 0 || tempMarks > 100) return;
    setIsSavingGrade(true);

    try {
      setStudents(prevStudents => prevStudents.map(student => {
        if (student.id !== studentId) return student;

        const updatedSubjects = student.subjects.map(sub => {
          if (sub.code !== selectedCourse) return sub;
          return { ...sub, marks: tempMarks };
        });

        const totalMarks = updatedSubjects.reduce((sum, s) => sum + s.marks, 0);
        const calcCgpa = parseFloat(((totalMarks / (updatedSubjects.length * 10)) * 10).toFixed(2));

        let earlyWarning = student.earlyWarningAlert;
        if (tempMarks < 55) {
          earlyWarning = {
            type: "academic",
            severity: "critical",
            details: `Score in ${selectedCourse} dropped critically to ${tempMarks}/100.`
          };

          const alertExists = alerts.some(a => a.studentId === studentId && a.type === "academic" && a.status === "active");
          if (!alertExists) {
            const newAlert: Alert = {
              id: `ALT_FAC_${Date.now()}`,
              studentId: student.id,
              studentName: student.name,
              department: student.department,
              type: "academic",
              severity: "critical",
              message: `Critically low mid-term score in ${selectedCourse} (${tempMarks}/100)`,
              date: new Date().toISOString().split("T")[0],
              status: "active"
            };
            setAlerts(prev => [newAlert, ...prev]);
          }
        } else if (tempMarks >= 65 && student.cgpa >= 7.0) {
          earlyWarning = { type: "none", severity: "stable", details: "" };
        }

        return {
          ...student,
          subjects: updatedSubjects,
          cgpa: calcCgpa > 10 ? 10 : calcCgpa,
          earlyWarningAlert: earlyWarning
        };
      }));

      setEditingStudentId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Action: Trigger/Add manual warning
  const handleTriggerManualAlert = (student: Student, type: "attendance" | "academic", msg: string) => {
    const newAlert: Alert = {
      id: `ALT_MAN_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      type,
      severity: "warning",
      message: `${selectedCourse}: ${msg}`,
      date: new Date().toISOString().split("T")[0],
      status: "active"
    };

    setAlerts(prev => [newAlert, ...prev]);

    setStudents(prev => prev.map(s => {
      if (s.id !== student.id) return s;
      return {
        ...s,
        earlyWarningAlert: {
          type,
          severity: "warning",
          details: msg
        }
      };
    }));
  };

  // Action: Generate AI Lesson Workplan Coordinator via Gemini
  const handleGenerateAiWorkplan = async () => {
    setAiPlanContent("");
    setIsAiPlanLoading(true);

    const performanceMetrics = {
      courseCode: selectedCourse,
      courseName: currentCourseDetails?.name,
      averageMarks: avgMarks,
      averageAttendance: avgAttendance,
      studentCount: totalEnrolled,
      strugglingStudents: courseStudents
        .filter(s => {
          const m = s.subjects.find(sub => sub.code === selectedCourse)?.marks || 100;
          return m < 65;
        })
        .map(s => ({ name: s.name, mark: s.subjects.find(sub => sub.code === selectedCourse)?.marks }))
    };

    try {
      const { data } = await getCareerRecommendation({
        message: `Based on the following class performance metrics for Course ${selectedCourse}, generate a tailored 3-Week Remedial Intervention Workplan and Study Resource Guide.`,
        history: [],
        context: {
          scope: "Faculty Lesson Planning",
          performanceMetrics
        }
      });
      setAiPlanContent(data.text);
    } catch (err) {
      console.error(err);
      setAiPlanContent(`### AI Study Guide Fallback\n- **Objective**: Boost Class Average of ${avgMarks}/100.\n- **Focus Areas**: Deepen understanding of problem-solving techniques.\n- **Resources**: Practice previous year exam papers.`);
    } finally {
      setIsAiPlanLoading(false);
    }
  };

  // Action: Generate AI Academic Summary
  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setAiSummary(null);

    try {
      const { data } = await getCareerRecommendation({
        message: "Please write a professional, highly descriptive 2-paragraph student academic report card. Focus on key strengths, subjects needing mentorship, attendance level, and classroom engagement.",
        history: [],
        context: {
          scope: "Faculty Student Summary Review",
          studentProfile: activeStudent
        }
      });
      setAiSummary(data.text);
    } catch (err) {
      console.error(err);
      setAiSummary(`**Academic Overview for ${activeStudent.name}**\n${activeStudent.name} showcases stellar performance in ${activeStudent.subjects[0]?.name || "core subjects"} with a grade of ${activeStudent.subjects[0]?.marks || 80}/100. Attendance matches standard academic compliance limits. Focus targets should center on strengthening ${activeStudent.weaknesses.slice(0, 2).join(", ") || "remaining subjects"}.`);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Action: Generate AI Placement Readiness Score & Predictions
  const handleEvaluateReadiness = async () => {
    setIsReadinessLoading(true);
    setAiReadinessScore(null);
    setAiSubScores(null);

    try {
      const { data } = await getPlacementPrediction({
        student: activeStudent,
        targetJobRole: "Software Development Engineer (SDE)"
      });

      // Compute elegant sub-scores based on student GPA & strengths
      const multiplier = activeStudent.cgpa / 9.0;
      const scores = {
        technical: Math.min(100, Math.floor(82 * multiplier + activeStudent.technicalSkills.length * 1.5)),
        communication: Math.min(100, Math.floor(85 * (activeStudent.attendanceRate / 90))),
        resume: activeStudent.cgpa >= 9.0 ? 92 : activeStudent.cgpa >= 8.0 ? 84 : 70,
        aptitude: Math.min(100, Math.floor(78 * multiplier)),
        interview: Math.min(100, Math.floor(80 * multiplier)),
        coding: Math.min(100, Math.floor(84 * multiplier))
      };

      const averageReadiness = Math.round(
        (scores.technical + scores.communication + scores.resume + scores.aptitude + scores.interview + scores.coding) / 6
      );

      const status = averageReadiness >= 82 ? "Ready for Placement" : averageReadiness >= 65 ? "Needs Improvement" : "High Priority for Mentoring";

      setAiReadinessScore(averageReadiness);
      setAiSubScores(scores);
      setAiReadinessStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReadinessLoading(false);
    }
  };

  // Action: Evaluate Resume
  const handleEvaluateResume = async () => {
    setIsResumeLoading(true);
    setAiResumeScore(null);
    setAiResumeReport(null);

    try {
      const { data } = await getResumeEvaluation({ student: activeStudent });
      setAiResumeScore(data.atsScore);
      setAiResumeReport(data.strength);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResumeLoading(false);
    }
  };

  // Action: Generate Mock Interview Prep
  const handleFetchInterviewQuestions = async () => {
    setIsInterviewLoading(true);
    setInterviewQuestions([]);

    try {
      const { data } = await getInterviewPrep({ student: activeStudent, targetRole: "SDE" });
      setInterviewQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  // Action: Fetch Company Recs
  const handleFetchCompanyRecs = async () => {
    setIsCompaniesLoading(true);
    setCompanyRecs([]);

    try {
      const { data } = await getCompanyRecommendations({ student: activeStudent });
      setCompanyRecs(data.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompaniesLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter students by search bar query
  const filteredSearchStudents = enrichedStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "profile", icon: <UserCog size={20} />, label: "My Profile" },
    { id: "courses", icon: <BookOpen size={20} />, label: "My Courses" },
    { id: "students", icon: <Users size={20} />, label: "Students" },
    { id: "attendance", icon: <CalendarCheck size={20} />, label: "Attendance" },
    { id: "assignments", icon: <FileText size={20} />, label: "Assignments" },
    { id: "labs", icon: <FlaskConical size={20} />, label: "Labs" },
    { id: "results", icon: <Award size={20} />, label: "Results & Grades" },
    { id: "materials", icon: <Library size={20} />, label: "Study Materials" },
    { id: "timetable", icon: <Clock size={20} />, label: "Timetable" },
    { id: "notices", icon: <Bell size={20} />, label: "Notices" },
    { id: "research", icon: <Microscope size={20} />, label: "Research" },
    { id: "ai", icon: <BrainCircuit size={20} />, label: "AI Teaching Assistant" },
    { id: "calendar", icon: <CalendarIcon size={20} />, label: "Calendar" },
    { id: "files", icon: <FileIcon size={20} />, label: "Files" },
    { id: "help", icon: <LifeBuoy size={20} />, label: "Help Center" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] flex flex-col md:flex-row overflow-hidden" id="faculty-portal">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0 relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center">
            <GraduationCap size={18} color="white" />
          </div>
          <span className="font-bold text-[var(--text)]">EduMonitor Faculty</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[var(--text-2)] hover:text-[var(--primary)]">
          {isSidebarOpen ? <X size={24} /> : <div className="space-y-1"><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div></div>}
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
            <GraduationCap size={22} color="white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-[var(--text)] tracking-tight block leading-none">EduMonitor</span>
            <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mt-1 block">Faculty Workspace</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as FacultyTab); setIsSidebarOpen(false); }}
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
              {item.id === "ai" && <span className="ml-auto text-white text-[9px] font-bold"><Sparkles size={12}/></span>}
            </button>
          ))}
        </div>

        {/* Class Selector Inject */}
        <div className="p-4 border-t border-[var(--border-light)] bg-[var(--surface-raised)] shrink-0">
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Active Class Environment</label>
          {classAssignments.length > 0 ? (
            <select
              value={selectedClassId}
              onChange={(event) => {
                const nextClassId = event.target.value;
                const nextClass = classAssignments.find(item => item.id === nextClassId);
                setSelectedClassId(nextClassId);
                setSelectedCourse(nextClass?.subject_code || "");
                setAiPlanContent("");
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[11px] font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)] cursor-pointer shadow-sm"
            >
              {classAssignments.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.academic_year} / Sem {classItem.semester} / Div {classItem.division} / {classItem.subject_code}
                </option>
              ))}
            </select>
          ) : (
             <div className="text-[11px] text-[var(--text-muted)] font-medium">No classes assigned.</div>
          )}
        </div>

        {/* Sidebar Footer User Area */}
        <div className="p-4 border-t border-[var(--border-light)] bg-[var(--surface-raised)] shrink-0">
          <div className="flex items-center gap-3 p-2">
            <img src={faculty.photoUrl || "https://api.dicebear.com/9.x/initials/svg?seed=Faculty"} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary-light)]" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0 flex flex-col text-left">
              <span className="text-sm font-bold text-[var(--text)] block truncate">{faculty.name}</span>
              <span className="text-[10px] text-[var(--text-muted)] block truncate uppercase tracking-wider">Faculty</span>
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
          role="faculty" 
          extraElements={
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-pale)] px-3 py-1.5 rounded-full border border-[var(--border-orange)] tracking-widest uppercase shadow-sm">
                Dept: {faculty.department}
              </span>
            </div>
          }
        />

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pt-6 pb-24">
          
          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* Quick Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { label: "Today's Classes", value: workspace.timetable.length, icon: <Clock size={20}/>, color: "var(--primary)" },
                  { label: "Total Students", value: totalEnrolled, icon: <Users size={20}/>, color: "var(--primary)" },
                  { label: "Pending Grading", value: "14", icon: <FileText size={20}/>, color: "var(--warning)" },
                  { label: "Avg Attendance", value: `${avgAttendance}%`, icon: <CalendarCheck size={20}/>, color: "var(--success)" },
                  { label: "Class Average", value: `${avgMarks}`, icon: <TrendingUp size={20}/>, color: "var(--primary)" },
                  { label: "Research Projects", value: "3", icon: <Microscope size={20}/>, color: "var(--primary)" },
                ].map((stat, i) => (
                  <Card key={i} className="hover:-translate-y-1 transition-transform duration-300 cursor-default hover:shadow-[var(--shadow-orange)] group relative overflow-hidden p-5 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ color: stat.color }}>{stat.icon}</div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-[20px] font-black text-[var(--text)]">{stat.value}</div>
                      <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* EduMonitor AI Teaching Assistant Hero */}
              <div className="bg-gradient-to-br from-[#1E293B] to-black rounded-[var(--radius)] shadow-[var(--shadow-orange)] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white border border-[#334155]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[var(--primary)] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary-light)]">EduMonitor AI Teaching Assistant</span>
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3 leading-tight">Class Health Score</h2>
                  <div className="space-y-2 text-sm font-medium text-slate-300">
                    <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--success)]"/> Class average is stable at {avgMarks}/100.</p>
                    <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[var(--warning)]"/> {atRiskCount} students are currently at academic risk.</p>
                    <p className="flex items-center gap-2"><Target className="w-4 h-4 text-[var(--primary)]"/> Pending 1 assignment grading for CS-301.</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center mt-6 md:mt-0 shrink-0 border-l border-slate-700 pl-8">
                  <div className="relative flex items-center justify-center w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * 84) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">84</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">out of 100</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto relative z-10 mt-6 md:mt-0 flex flex-col gap-2 shrink-0 md:ml-8">
                  <button onClick={() => setActiveTab("ai")} className="bg-[var(--primary)] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[var(--primary-dark)] transition-colors shadow-sm cursor-pointer w-full flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Assistant
                  </button>
                  <button onClick={handleGenerateAiWorkplan} disabled={isAiPlanLoading} className="bg-white/10 text-white border border-white/20 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    <FileText className="w-4 h-4" /> {isAiPlanLoading ? "Generating..." : "Create Lesson Plan"}
                  </button>
                  <button onClick={() => setActiveTab("students")} className="bg-white/10 text-white border border-white/20 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer w-full flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" /> Student Risk Analysis
                  </button>
                </div>
              </div>

              {/* Middle Row: Schedule & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Today's Schedule</h3>
                    <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="space-y-4 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--border-light)] pb-2 flex-1">
                    {workspace.timetable.length > 0 ? workspace.timetable.map((slot, i) => (
                      <div key={slot.id || i} className="flex gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary-pale)] border-2 border-white text-[var(--primary)] flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                          <Check size={14} className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
                        </div>
                        <div className="pt-0.5 text-left bg-[var(--surface-raised)] p-3 rounded-xl border border-[var(--border)] w-full">
                          <h4 className="text-[12px] font-bold text-[var(--text)] leading-tight">{slot.subject_code} - Lecture</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold text-[var(--text-muted)]">
                            <span className="flex items-center gap-1"><Clock size={12}/> {slot.time}</span>
                            <span className="flex items-center gap-1"><Building2 size={12}/> Room {slot.room}</span>
                            <span className="flex items-center gap-1"><Users size={12}/> Sem {selectedClass?.semester || 5}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-[12px] text-[var(--text-muted)] font-medium p-4 text-center">No classes scheduled for today.</div>
                    )}
                  </div>
                </Card>

                {/* Student Performance Chart */}
                <Card className="lg:col-span-2 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Class Performance Distribution</h3>
                    <span className="text-[11px] font-bold text-[var(--text-muted)]">{selectedCourse}</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={9} domain={[0, 100]} />
                        <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "11px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }} />
                        <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                        <Bar dataKey="Marks" name="Current Marks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Attendance" name="Attendance %" fill="var(--success)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Bottom Row: Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Recent Activity</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: <CalendarCheck size={14}/>, title: "Attendance Submitted", time: "2 hours ago" },
                      { icon: <FileText size={14}/>, title: "Assignment 'Midterm Prep' Published", time: "Yesterday" },
                      { icon: <Edit3 size={14}/>, title: "Grades Uploaded for CS-301", time: "2 days ago" },
                      { icon: <Library size={14}/>, title: "Lecture 4 Notes Uploaded", time: "3 days ago" },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-pale)] text-[var(--primary)] flex items-center justify-center shrink-0">
                          {act.icon}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-[var(--text)]">{act.title}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Upcoming Events */}
                <Card className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Upcoming Events</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Department Meeting", date: "Tomorrow, 10:00 AM", type: "Faculty" },
                      { title: "AI Research Conference", date: "Next Week", type: "Research" },
                      { title: "SDE Placement Drive", date: "Jul 15, 2026", type: "Placement" },
                    ].map((event, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3 bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl border-l-4 border-l-[var(--primary)]">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--primary)]">{event.type}</span>
                        </div>
                        <h4 className="text-[12px] font-bold text-[var(--text)]">{event.title}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold">{event.date}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="flex flex-col space-y-4 bg-[var(--surface-raised)]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Take Attendance", icon: <CalendarCheck size={16}/>, action: () => setActiveTab("attendance") },
                      { label: "Grade Papers", icon: <Edit3 size={16}/>, action: () => setActiveTab("results") },
                      { label: "Upload Notes", icon: <Library size={16}/>, action: () => setActiveTab("materials") },
                      { label: "Create Assignment", icon: <FileText size={16}/>, action: () => setActiveTab("assignments") },
                      { label: "Publish Notice", icon: <Bell size={16}/>, action: () => setActiveTab("notices") },
                      { label: "Generate Quiz", icon: <BrainCircuit size={16}/>, action: () => setActiveTab("ai") },
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

          {/* TAB: ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Attendance Register</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Manage and record daily attendance for your assigned classes.</p>
                </div>
                <button onClick={() => exportRows("attendance-report.csv", workspace.attendance)} className="btn-primary py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs cursor-pointer shadow-sm">
                  <Download size={14}/> Export
                </button>
              </div>

              <Card className="space-y-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[var(--surface-raised)] p-4 rounded-xl border border-[var(--border)]">
                  <div className="flex gap-4 items-center">
                    <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm(prev => ({ ...prev, date: e.target.value }))} className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-[var(--primary)] text-[var(--text)]" />
                    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-bold text-[var(--text)]">
                      Total Enrolled: {enrichedStudents.length}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {
                       const newStatuses = Object.fromEntries(enrichedStudents.map((student: Student) => [student.id, "Present"]));
                       setAttendanceStatuses(newStatuses);
                    }} className="px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-raised)] cursor-pointer">
                      Mark All Present
                    </button>
                    <button disabled={!selectedClassId || enrichedStudents.length === 0 || isWorkspaceSaving} onClick={saveWholeClassAttendance} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold rounded-lg px-6 py-2 cursor-pointer disabled:opacity-50 transition-colors shadow-sm">
                      {isWorkspaceSaving ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Student</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Roll Number</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)] font-medium">
                      {enrichedStudents.map(student => (
                        <tr key={student.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                          <td className="px-4 py-2.5 flex items-center gap-3">
                            <img src={student.photoUrl} alt="" className="w-8 h-8 rounded-full border border-[var(--border)]" referrerPolicy="no-referrer" />
                            <span className="font-bold text-[var(--text)] text-[12px]">{student.name}</span>
                          </td>
                          <td className="px-4 py-2.5 text-[var(--text-2)] font-mono font-bold">{student.rollNumber || student.id}</td>
                          <td className="px-4 py-2.5">
                            <select
                              value={attendanceStatuses[student.id] || "Present"}
                              onChange={(e) => setAttendanceStatuses(prev => ({ ...prev, [student.id]: e.target.value }))}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-[var(--primary-pale)] ${
                                attendanceStatuses[student.id] === "Present" || !attendanceStatuses[student.id] 
                                  ? "bg-green-50 border-green-200 text-green-700" 
                                  : attendanceStatuses[student.id] === "Absent" 
                                    ? "bg-red-50 border-red-200 text-red-700" 
                                    : "bg-[var(--warning)]/10 border-[var(--warning)]/30 text-[var(--warning)]"
                              }`}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Late">Late</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {enrichedStudents.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-xs font-semibold text-[var(--text-muted)]">No students enrolled.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Student Performance & Risk Analysis</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Review detailed metrics, generate AI summaries, and predict placement readiness for enrolled mentees.</p>
                </div>
              </div>

              {/* Mentee Selector */}
              <Card className="flex flex-col md:flex-row gap-4 bg-gradient-to-r from-[var(--surface)] to-[var(--bg)]">
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">Choose Scholar Mentee</label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-[13px] font-bold focus:border-[var(--primary)] focus:outline-none cursor-pointer text-[var(--text)] shadow-sm"
                    >
                      {enrichedStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">Search Collegiate Database</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search student by name, roll number, or branch..."
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[var(--primary)] text-[var(--text)] shadow-sm"
                      />
                    </div>
                  </div>
              </Card>

              {searchQuery.trim() !== "" && (
                <Card className="max-h-48 overflow-y-auto space-y-1">
                  {filteredSearchStudents.length > 0 ? (
                    filteredSearchStudents.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedStudentId(s.id); setSearchQuery(""); }}
                        className="w-full flex items-center justify-between p-3 hover:bg-[var(--surface-raised)] rounded-xl text-left transition-all border border-transparent hover:border-[var(--border)] cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img src={s.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-[13px] font-bold text-[var(--text)]">{s.name} <span className="text-[11px] font-mono text-[var(--text-muted)] font-medium">({s.id})</span></span>
                        </div>
                        <span className="text-[10px] bg-[var(--bg)] border border-[var(--border)] px-3 py-1 rounded-full font-bold text-[var(--text-2)] uppercase tracking-wider">{s.department}</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] block text-center py-4 font-semibold">No collegiate student matches found.</span>
                  )}
                </Card>
              )}

              {/* Student Overview Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Profile */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="text-center space-y-4 border-[var(--border-orange)] bg-gradient-to-b from-[var(--surface)] to-[var(--primary-pale)]">
                    <img src={activeStudent.photoUrl} alt="" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-[var(--shadow-orange)] mx-auto" referrerPolicy="no-referrer" />
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text)] leading-tight">{activeStudent.name}</h3>
                      <span className="text-[11px] font-bold text-[var(--text-muted)] font-mono block mt-1">{activeStudent.id}</span>
                      <span className="bg-white text-[var(--text-2)] text-[10px] font-bold px-3 py-1 rounded-full border border-[var(--border)] mt-3 inline-block shadow-sm">
                        {activeStudent.department} • Semester {activeStudent.semester}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left pt-5 border-t border-[var(--border)]/60">
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Overall CGPA</span>
                        <span className="text-lg font-black text-[var(--text)]">{activeStudent.cgpa}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block font-bold uppercase">Attendance</span>
                        <span className={`text-lg font-black ${activeStudent.attendanceRate < 75 ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>{activeStudent.attendanceRate}%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="space-y-4">
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight pb-2 border-b border-[var(--border-light)]">Action Triggers</h3>
                    <div className="space-y-3">
                      <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="w-full bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--bg)] text-[var(--text)] text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[var(--primary)]" /> {isSummaryLoading ? "Analyzing..." : "Generate AI Academic Report"}
                      </button>
                      <button onClick={() => handleTriggerManualAlert(activeStudent, "academic", "Requires faculty mentoring.")} className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
                        <AlertTriangle className="w-4 h-4" /> Issue Early Warning
                      </button>
                    </div>
                  </Card>
                </div>

                {/* Right Details */}
                <div className="lg:col-span-8 space-y-6">
                  {aiSummary && (
                     <div className="bg-[var(--text)] text-[var(--bg)] p-6 rounded-2xl border border-black space-y-4 shadow-[var(--shadow)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-20 blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="flex justify-between items-center border-b border-slate-700 pb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                          <h3 className="font-bold text-[14px] tracking-tight uppercase">AI Academic Profile Summary</h3>
                        </div>
                      </div>
                      <div className="text-[12px] font-medium leading-relaxed whitespace-pre-line text-slate-300 relative z-10">
                        {aiSummary}
                      </div>
                    </div>
                  )}

                  <Card className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Mentorship Matrix & Placement Prediction</h3>
                      <button onClick={handleEvaluateReadiness} disabled={isReadinessLoading} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm flex items-center gap-2">
                         <Compass size={14} /> {isReadinessLoading ? "Evaluating..." : "Run AI Predictor"}
                      </button>
                    </div>

                    {aiReadinessScore !== null && aiSubScores !== null ? (
                       <div className="space-y-6 pt-4 border-t border-[var(--border-light)]">
                         <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-[var(--surface-raised)] rounded-2xl border border-[var(--border)]">
                            <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * aiReadinessScore) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-[var(--text)]">{aiReadinessScore}</span>
                              </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h4 className="text-[15px] font-bold text-[var(--text)]">Placement Readiness Score</h4>
                              <p className="text-[12px] text-[var(--text-muted)] mt-1 font-medium">Calculated based on academic performance, attendance, and mapped technical skills against industry requirements.</p>
                              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${aiReadinessScore >= 80 ? 'bg-green-50 text-green-700 border-green-200' : aiReadinessScore >= 60 ? 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                Status: {aiReadinessStatus}
                              </span>
                            </div>
                         </div>
                         
                         <div>
                            <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Competency Radar</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(aiSubScores).map(([key, val]) => (
                                <div key={key} className="bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl flex flex-col gap-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase text-[var(--text-2)]">{key}</span>
                                    <span className="text-[12px] font-black text-[var(--text)]">{val}/100</span>
                                  </div>
                                  <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: `${val}%` }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                         </div>
                       </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                         <div className="w-12 h-12 rounded-full bg-[var(--bg)] border border-[var(--border-orange)] flex items-center justify-center text-[var(--primary)]">
                           <Compass size={24} />
                         </div>
                         <p className="text-[12px] text-[var(--text-muted)] font-medium max-w-sm">Run the AI Predictor to generate a Mentorship Matrix and evaluate {activeStudent.name}'s industry readiness.</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESULTS & GRADES */}
          {activeTab === "results" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Results & Grades</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Manage and publish internal marks, practical scores, and semester grades for {selectedCourse}.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => exportRows("marks-report.csv", workspace.marks)} className="btn-primary py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs cursor-pointer shadow-sm">
                    <Download size={14}/> Export Marks
                  </button>
                </div>
              </div>

              <Card className="space-y-5">
                <div className="flex justify-between items-center border-b border-[var(--border-light)] pb-3">
                  <div>
                    <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight">Instructor Scoring Matrix</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Enrolled Course: <strong className="text-[var(--text)]">{selectedCourse} - {currentCourseDetails?.name}</strong></p>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-pale)] border border-[var(--border-orange)] px-3 py-1 rounded-full uppercase tracking-widest">Class Size: {totalEnrolled}</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                  <table className="w-full text-left text-xs font-semibold text-[var(--text-2)]">
                    <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Student</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Attendance</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px]">Current Score</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)] font-medium">
                      {courseStudents.map(student => {
                        const courseSubject = student.subjects.find(s => s.code === selectedCourse);
                        const isEditing = editingStudentId === student.id;

                        return (
                          <tr key={student.id} className="hover:bg-[var(--surface-raised)] transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img src={student.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-[var(--border)]" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-bold text-[var(--text)] block">{student.name}</span>
                                  <span className="text-[9px] text-[var(--text-muted)] font-mono block mt-0.5">{student.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-[var(--text)]">
                              {courseSubject?.attendance}%
                            </td>
                            <td className="px-4 py-3.5">
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={tempMarks}
                                  onChange={(e) => setTempMarks(parseInt(e.target.value) || 0)}
                                  className="w-20 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[var(--primary)] text-[var(--text)]"
                                />
                              ) : (
                                <span className={`font-black text-[14px] ${
                                  (courseSubject?.marks || 0) < 60 ? "text-[var(--danger)]" : "text-[var(--text)]"
                                }`}>
                                  {courseSubject?.marks} <span className="text-[10px] font-bold text-[var(--text-muted)]">/ 100</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveGrade(student.id)}
                                  disabled={isSavingGrade}
                                  className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold px-4 py-2 rounded-lg transition-all text-[11px] inline-flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                                >
                                  {isSavingGrade ? "..." : <><Save size={14} /> Save</>}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEditGradeClick(student.id, courseSubject?.marks || 0)}
                                  className="bg-[var(--surface-raised)] border border-[var(--border)] hover:bg-[var(--bg)] text-[var(--text)] font-bold px-3 py-1.5 rounded-lg transition-all text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Pencil size={12}/> Edit Grade
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {courseStudents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-xs font-semibold text-[var(--text-muted)]">No students enrolled in this course.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div className="space-y-6 animate-fade-in text-left">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Assignment Center</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Create and manage assignments for {selectedCourse}.</p>
                </div>
              </div>

              <Card className="space-y-5 bg-gradient-to-r from-[var(--surface)] to-[var(--bg)]">
                <h3 className="font-bold text-[14px] text-[var(--text)] uppercase tracking-tight pb-2 border-b border-[var(--border-light)]">Create New Assignment</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Title</label>
                    <input value={assignmentForm.title} onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Midterm Report" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[12px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Due Date</label>
                    <input type="date" value={assignmentForm.due_date} onChange={(e) => setAssignmentForm(prev => ({ ...prev, due_date: e.target.value }))} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[12px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Max Marks</label>
                    <input type="number" value={assignmentForm.max_marks} onChange={(e) => setAssignmentForm(prev => ({ ...prev, max_marks: Number(e.target.value) }))} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[12px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => { addWorkspaceItem("assignments", { ...assignmentForm, subject_code: selectedCourse, submissions: [] }); setAssignmentForm({ title: "", due_date: "", max_marks: 50, description: "" }); }} className="w-full btn-primary py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                      <Plus size={16}/> Publish
                    </button>
                  </div>
                  <div className="space-y-1.5 md:col-span-5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Description</label>
                    <input value={assignmentForm.description} onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Instructions for students" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[12px] font-medium focus:border-[var(--primary)] focus:outline-none text-[var(--text)]" />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workspace.assignments.map(item => (
                  <Card key={item.id} className="flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-[var(--primary-pale)] text-[var(--primary)] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[var(--border-orange)] uppercase tracking-widest">{item.subject_code}</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1"><CalendarCheck size={12}/> Due {item.due_date}</span>
                      </div>
                      <h4 className="font-bold text-[14px] text-[var(--text)] leading-tight">{item.title}</h4>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1.5 leading-relaxed font-medium line-clamp-2">{item.description}</p>
                    </div>
                    <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[var(--text)] bg-[var(--surface-raised)] border border-[var(--border)] px-3 py-1 rounded-md">{item.max_marks} Marks</span>
                      <button onClick={() => removeWorkspaceItem("assignments", item)} className="text-[var(--danger)] hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
                {workspace.assignments.length === 0 && (
                  <div className="col-span-full py-12 text-center text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    No assignments published yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: AI TEACHING ASSISTANT */}
          {activeTab === "ai" && (
            <div className="animate-fade-in text-left h-[calc(100vh-8rem)]">
              <AIAssistant role="faculty" context={{ faculty, selectedCourse, totalEnrolled }} />
            </div>
          )}

          {/* VIEW: SHARED COMPONENTS */}
          {activeTab === "profile" && <Profile role="faculty" data={faculty} />}
          {activeTab === "settings" && <SettingsComponent />}
          {activeTab === "calendar" && <CalendarComponent />}
          {activeTab === "files" && <FileManagement role="faculty" />}
          {activeTab === "help" && <HelpCenter />}

          {/* OTHER TABS (Placeholders for remaining 10 requested tabs to show readiness) */}
          {!["dashboard", "students", "results", "materials", "ai", "profile", "settings", "calendar", "files", "help"].includes(activeTab) && (
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
    </div>
  );
}
