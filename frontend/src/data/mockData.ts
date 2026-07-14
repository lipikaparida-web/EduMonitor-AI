import { Student, Alert, Faculty, Admin } from "../types";

export const adminProfile: Admin = {
  name: "Dr. Rajeshwar Sharma",
  email: "admin@college.edu",
  role: "Chief Academic Administrator",
  department: "Academic Affairs",
  photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
};

export const facultyList: Faculty[] = [
  {
    id: "FAC001",
    name: "Dr. Amit Verma",
    email: "prof.verma@college.edu",
    department: "Computer Science",
    courses: [
      { code: "CS-301", name: "Data Structures & Algorithms" },
      { code: "CS-302", name: "Database Management Systems" }
    ],
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "FAC002",
    name: "Prof. Priya Nair",
    email: "prof.priya@college.edu",
    department: "Electronics",
    courses: [
      { code: "EC-303", name: "Microprocessors & Interfaces" },
      { code: "EC-304", name: "Digital Signal Processing" }
    ],
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face"
  }
];

export const initialStudents: Student[] = [
  {
    id: "STU2024001",
    name: "Aarav Mehta",
    semester: 6,
    department: "Computer Science",
    email: "aarav.mehta@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 94,
    cgpa: 9.2,
    historySGPA: [
      { semester: 1, sgpa: 8.8 },
      { semester: 2, sgpa: 9.0 },
      { semester: 3, sgpa: 9.1 },
      { semester: 4, sgpa: 9.3 },
      { semester: 5, sgpa: 9.4 }
    ],
    subjects: [
      { name: "Data Structures & Algorithms", code: "CS-301", marks: 95, maxMarks: 100, attendance: 95, facultyName: "Dr. Amit Verma" },
      { name: "Database Management Systems", code: "CS-302", marks: 91, maxMarks: 100, attendance: 92, facultyName: "Dr. Amit Verma" },
      { name: "Web Engineering", code: "CS-305", marks: 94, maxMarks: 100, attendance: 96, facultyName: "Prof. Rohan Das" },
      { name: "Theory of Computation", code: "CS-306", marks: 88, maxMarks: 100, attendance: 93, facultyName: "Dr. Amit Verma" }
    ],
    strengths: ["Algorithms", "Full-Stack Web Dev", "Problem Solving"],
    weaknesses: ["Compiler Design", "Formal Systems"],
    technicalSkills: ["React", "Node.js", "Python", "TypeScript", "C++", "SQL"],
    softSkills: ["Leadership", "Public Speaking", "Teamwork"],
    extracurriculars: ["Hackathon Coordinator", "Coding Club President", "Guitarist"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "Software Development Engineer (SDE)",
        probability: 95,
        status: "Highly Likely",
        reason: "Excellent DS/Algo record, multiple hackathon wins, solid fullstack portfolio, CGPA > 9.0.",
        missingSkills: ["System Design fundamentals"],
        recommendedCertifications: ["AWS Certified Developer Associate"]
      },
      {
        role: "Data Analyst",
        probability: 88,
        status: "Highly Likely",
        reason: "Strong Python skills and DB fundamentals; highly analytical mindset.",
        missingSkills: ["Tableau/PowerBI", "NoSQL"],
        recommendedCertifications: ["Google Data Analytics Professional Certificate"]
      },
      {
        role: "Cloud Engineer",
        probability: 72,
        status: "Eligible with Prep",
        reason: "Capable coding skills, but needs deeper cloud infrastructure understanding.",
        missingSkills: ["AWS/Azure basics", "Docker", "Kubernetes"],
        recommendedCertifications: ["AWS Certified Solutions Architect"]
      }
    ]
  },
  {
    id: "STU2024002",
    name: "Ananya Iyer",
    semester: 6,
    department: "Computer Science",
    email: "ananya.iyer@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 91,
    cgpa: 8.7,
    historySGPA: [
      { semester: 1, sgpa: 8.2 },
      { semester: 2, sgpa: 8.4 },
      { semester: 3, sgpa: 8.6 },
      { semester: 4, sgpa: 8.8 },
      { semester: 5, sgpa: 8.9 }
    ],
    subjects: [
      { name: "Data Structures & Algorithms", code: "CS-301", marks: 88, maxMarks: 100, attendance: 90, facultyName: "Dr. Amit Verma" },
      { name: "Database Management Systems", code: "CS-302", marks: 89, maxMarks: 100, attendance: 92, facultyName: "Dr. Amit Verma" },
      { name: "Web Engineering", code: "CS-305", marks: 92, maxMarks: 100, attendance: 93, facultyName: "Prof. Rohan Das" },
      { name: "Theory of Computation", code: "CS-306", marks: 79, maxMarks: 100, attendance: 88, facultyName: "Dr. Amit Verma" }
    ],
    strengths: ["Data Analytics", "UI/UX Design", "SQL Databases"],
    weaknesses: ["Systems Programming", "Dynamic Programming"],
    technicalSkills: ["SQL", "Figma", "Python", "React", "Tableau", "Java"],
    softSkills: ["Empathetic Communication", "Technical Writing", "Presentation"],
    extracurriculars: ["Design Society Lead", "Literary Club Member", "Classical Dance"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "UX Researcher & Designer",
        probability: 92,
        status: "Highly Likely",
        reason: "Stellar Figma skills, extensive UI/UX case studies, superb presentation and empathetic communication.",
        missingSkills: ["A/B Testing tooling", "Advanced Interaction design"],
        recommendedCertifications: ["Google UX Design Certificate"]
      },
      {
        role: "Data Analyst",
        probability: 85,
        status: "Highly Likely",
        reason: "Good grasp of SQL, Tableau, and Python data visualization libraries.",
        missingSkills: ["Advanced R Programming"],
        recommendedCertifications: ["Microsoft Certified: Power BI Data Analyst Associate"]
      },
      {
        role: "Software Development Engineer (SDE)",
        probability: 78,
        status: "Eligible with Prep",
        reason: "Decent coding base, but needs to work on complex Data Structures and competitive programming.",
        missingSkills: ["Graph Algorithms", "Advanced DP"],
        recommendedCertifications: ["LeetCode 100 Days Badge"]
      }
    ]
  },
  {
    id: "STU2024003",
    name: "Rohan Das",
    semester: 6,
    department: "Computer Science",
    email: "rohan.das@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 68,
    cgpa: 6.4,
    historySGPA: [
      { semester: 1, sgpa: 7.2 },
      { semester: 2, sgpa: 7.0 },
      { semester: 3, sgpa: 6.5 },
      { semester: 4, sgpa: 6.1 },
      { semester: 5, sgpa: 5.8 }
    ],
    subjects: [
      { name: "Data Structures & Algorithms", code: "CS-301", marks: 54, maxMarks: 100, attendance: 65, facultyName: "Dr. Amit Verma" },
      { name: "Database Management Systems", code: "CS-302", marks: 58, maxMarks: 100, attendance: 70, facultyName: "Dr. Amit Verma" },
      { name: "Web Engineering", code: "CS-305", marks: 71, maxMarks: 100, attendance: 72, facultyName: "Prof. Rohan Das" },
      { name: "Theory of Computation", code: "CS-306", marks: 49, maxMarks: 100, attendance: 64, facultyName: "Dr. Amit Verma" }
    ],
    strengths: ["HTML/CSS", "Video Editing", "Social Media Tech"],
    weaknesses: ["Discrete Mathematics", "Data Structures", "Database Queries"],
    technicalSkills: ["JavaScript", "HTML5", "CSS3", "Photoshop", "Premiere Pro"],
    softSkills: ["Storytelling", "Video Production", "Interpersonal Skills"],
    extracurriculars: ["College Media Team Lead", "E-sports Club Coordinator"],
    isEligibleForPlacement: false,
    earlyWarningAlert: {
      type: "both",
      severity: "critical",
      details: "Attendance is at 68% (threshold: 75%). Marks in CS-301 and CS-306 are critically close to failing."
    },
    placementPredictions: [
      {
        role: "Software Development Engineer (SDE)",
        probability: 30,
        status: "Ineligible",
        reason: "CGPA (6.4) is below the minimum threshold (7.0) of major tech recruiters. Critical gaps in DS/Algo.",
        missingSkills: ["Core DSA", "Operating Systems", "Computer Networks", "Database query optimization"],
        recommendedCertifications: ["Algorithmic Specialization Bootcamp"]
      },
      {
        role: "Technical Writer & Content Specialist",
        probability: 70,
        status: "Needs Skill Upgrade",
        reason: "Great media skillset and storytelling, but needs to maintain higher attendance and pass exams.",
        missingSkills: ["API Documentation writing", "Markdown editors"],
        recommendedCertifications: ["Technical Writing Certification from Society for Technical Communication"]
      },
      {
        role: "Creative UI Designer",
        probability: 55,
        status: "Needs Skill Upgrade",
        reason: "Good aesthetic sense, but lacks proper UI/UX framework knowledge and prototyping tools.",
        missingSkills: ["Figma", "User Flow Diagrams", "Wireframing"],
        recommendedCertifications: ["Interaction Design Foundation UX Masterclass"]
      }
    ]
  },
  {
    id: "STU2024004",
    name: "Meera Krishnan",
    semester: 4,
    department: "Electronics",
    email: "meera.k@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 88,
    cgpa: 8.1,
    historySGPA: [
      { semester: 1, sgpa: 7.9 },
      { semester: 2, sgpa: 8.0 },
      { semester: 3, sgpa: 8.3 }
    ],
    subjects: [
      { name: "Microprocessors & Interfaces", code: "EC-303", marks: 84, maxMarks: 100, attendance: 90, facultyName: "Prof. Priya Nair" },
      { name: "Digital Signal Processing", code: "EC-304", marks: 78, maxMarks: 100, attendance: 86, facultyName: "Prof. Priya Nair" },
      { name: "Network Theory", code: "EC-307", marks: 81, maxMarks: 100, attendance: 88, facultyName: "Dr. S. K. Roy" },
      { name: "Electromagnetics", code: "EC-308", marks: 82, maxMarks: 100, attendance: 87, facultyName: "Dr. S. K. Roy" }
    ],
    strengths: ["Embedded C", "Circuit Simulation", "Digital Electronics"],
    weaknesses: ["Signals and Transforms", "Analog Communication"],
    technicalSkills: ["C", "Assembly Language", "MATLAB", "Arduino", "Verilog", "Proteus"],
    softSkills: ["Analytical Thinking", "Organization", "Report Writing"],
    extracurriculars: ["Electronics Club Member", "Classical violinist", "Volunteer, TechFest"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "Embedded Systems Engineer",
        probability: 85,
        status: "Highly Likely",
        reason: "Excellent grades in microprocessors, embedded coding projects, and circuit modeling.",
        missingSkills: ["RTOS basics", "Advanced PCB Design"],
        recommendedCertifications: ["Embedded Systems Certification by ARM"]
      },
      {
        role: "VLSI Design Engineer",
        probability: 65,
        status: "Eligible with Prep",
        reason: "Decent understanding of digital logic, but needs more simulation project experience using SystemVerilog.",
        missingSkills: ["SystemVerilog", "FPGA implementation"],
        recommendedCertifications: ["VLSI Design Fundamentals Cert"]
      }
    ]
  },
  {
    id: "STU2024005",
    name: "Kabir Malhotra",
    semester: 4,
    department: "Electronics",
    email: "kabir.m@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 74,
    cgpa: 7.2,
    historySGPA: [
      { semester: 1, sgpa: 7.5 },
      { semester: 2, sgpa: 7.3 },
      { semester: 3, sgpa: 6.9 }
    ],
    subjects: [
      { name: "Microprocessors & Interfaces", code: "EC-303", marks: 71, maxMarks: 100, attendance: 75, facultyName: "Prof. Priya Nair" },
      { name: "Digital Signal Processing", code: "EC-304", marks: 66, maxMarks: 100, attendance: 71, facultyName: "Prof. Priya Nair" },
      { name: "Network Theory", code: "EC-307", marks: 74, maxMarks: 100, attendance: 76, facultyName: "Dr. S. K. Roy" },
      { name: "Electromagnetics", code: "EC-308", marks: 61, maxMarks: 100, attendance: 72, facultyName: "Dr. S. K. Roy" }
    ],
    strengths: ["Microcontrollers", "Lab Work", "Physical Prototyping"],
    weaknesses: ["Mathematical Signals", "Electromagnetic Fields"],
    technicalSkills: ["Python", "C++", "Arduino", "Raspberry Pi", "Excel"],
    softSkills: ["Negotiation", "Crisis Management", "Collaborative Spirit"],
    extracurriculars: ["Robotics Club Vice President", "College Cricket Team Captain"],
    isEligibleForPlacement: true,
    earlyWarningAlert: {
      type: "attendance",
      severity: "warning",
      details: "Attendance is at 74% - slightly below mandatory 75%. Needs constant attendance in lab classes."
    },
    placementPredictions: [
      {
        role: "Robotics/Mechatronics Engineer",
        probability: 78,
        status: "Eligible with Prep",
        reason: "Great hands-on hardware skills and leadership in Robotics Club, but must maintain GPA above 7.0.",
        missingSkills: ["ROS (Robot Operating System)", "CAD Modelling basics"],
        recommendedCertifications: ["Robotics Foundations by Northwestern University"]
      },
      {
        role: "Embedded Systems Intern",
        probability: 72,
        status: "Eligible with Prep",
        reason: "Capable lab skills, good with microcontrollers, needs to improve mathematical theory basics.",
        missingSkills: ["RTOS principles", "I2C/SPI protocol details"],
        recommendedCertifications: ["Introduction to Embedded Systems on Coursera"]
      }
    ]
  },
  {
    id: "STU2024006",
    name: "Vikram Rathore",
    semester: 8,
    department: "Mechanical",
    email: "vikram.r@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 96,
    cgpa: 8.9,
    historySGPA: [
      { semester: 1, sgpa: 8.5 },
      { semester: 2, sgpa: 8.7 },
      { semester: 3, sgpa: 8.6 },
      { semester: 4, sgpa: 8.8 },
      { semester: 5, sgpa: 9.0 },
      { semester: 6, sgpa: 9.1 },
      { semester: 7, sgpa: 9.2 }
    ],
    subjects: [
      { name: "CAD/CAM", code: "ME-401", marks: 91, maxMarks: 100, attendance: 98, facultyName: "Dr. K. S. Murthy" },
      { name: "Fluid Dynamics", code: "ME-402", marks: 87, maxMarks: 100, attendance: 95, facultyName: "Dr. K. S. Murthy" },
      { name: "Finite Element Analysis", code: "ME-403", marks: 93, maxMarks: 100, attendance: 96, facultyName: "Prof. Anil Saxena" },
      { name: "Automobile Engineering", code: "ME-404", marks: 90, maxMarks: 100, attendance: 95, facultyName: "Prof. Anil Saxena" }
    ],
    strengths: ["3D Modeling", "Finite Element Methods", "Thermodynamics"],
    weaknesses: ["Fluid turbulence theory", "Materials metallurgy chemistry"],
    technicalSkills: ["SolidWorks", "ANSYS", "AutoCAD", "MATLAB", "Python"],
    softSkills: ["Project Management", "Technical Presentation", "Decision Making"],
    extracurriculars: ["Formula Student Racing Club Lead", "AeroModelling Club Coordinator"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "Mechanical Design Engineer",
        probability: 96,
        status: "Highly Likely",
        reason: "Superb SolidWorks & ANSYS proficiency, Formula Student leading role, 8.9 CGPA.",
        missingSkills: ["GD&T (Geometric Dimensioning and Tolerancing) standards"],
        recommendedCertifications: ["Certified SolidWorks Professional (CSWP)"]
      },
      {
        role: "FEA (Finite Element Analysis) Analyst",
        probability: 90,
        status: "Highly Likely",
        reason: "Stellar performance in FEA theory classes, hands-on stress analysis projects.",
        missingSkills: ["Non-linear analysis training"],
        recommendedCertifications: ["ANSYS Professional Certification"]
      }
    ]
  },
  {
    id: "STU2024007",
    name: "Riya Sen",
    semester: 4,
    department: "Information Technology",
    email: "riya.sen@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 98,
    cgpa: 9.6,
    historySGPA: [
      { semester: 1, sgpa: 9.5 },
      { semester: 2, sgpa: 9.7 },
      { semester: 3, sgpa: 9.6 }
    ],
    subjects: [
      { name: "Software Engineering", code: "IT-201", marks: 98, maxMarks: 100, attendance: 100, facultyName: "Prof. S. Sen" },
      { name: "Operating Systems", code: "IT-202", marks: 94, maxMarks: 100, attendance: 97, facultyName: "Dr. R. K. Bose" },
      { name: "Computer Networks", code: "IT-203", marks: 96, maxMarks: 100, attendance: 98, facultyName: "Dr. R. K. Bose" },
      { name: "Java Programming", code: "IT-204", marks: 97, maxMarks: 100, attendance: 97, facultyName: "Prof. S. Sen" }
    ],
    strengths: ["Cloud Computing", "Java Coding", "Algorithm Design"],
    weaknesses: ["Analog communication systems"],
    technicalSkills: ["Java", "AWS", "SQL", "Docker", "Git", "Spring Boot", "Python"],
    softSkills: ["Empathetic Teamwork", "Detail Orientation", "Problem Analysis"],
    extracurriculars: ["IEEE Student Branch Secretary", "Girls Who Code College Mentor", "Trekking"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "Cloud/DevOps Engineer",
        probability: 97,
        status: "Highly Likely",
        reason: "Perfect academic records, cloud-native projects with Docker, AWS certified already.",
        missingSkills: ["Kubernetes scale", "CI/CD pipeline fine-tuning"],
        recommendedCertifications: ["AWS Certified Solutions Architect - Professional"]
      },
      {
        role: "Backend Developer (Java)",
        probability: 95,
        status: "Highly Likely",
        reason: "Stellar Java & Spring Boot portfolio, impeccable database conceptual foundations.",
        missingSkills: ["Redis caching", "Kafka streaming"],
        recommendedCertifications: ["Oracle Certified Professional: Java SE Developer"]
      }
    ]
  },
  {
    id: "STU2024008",
    name: "Devendra Pratap",
    semester: 6,
    department: "Civil",
    email: "devendra.p@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 85,
    cgpa: 7.8,
    historySGPA: [
      { semester: 1, sgpa: 7.2 },
      { semester: 2, sgpa: 7.5 },
      { semester: 3, sgpa: 7.8 },
      { semester: 4, sgpa: 8.0 },
      { semester: 5, sgpa: 8.5 }
    ],
    subjects: [
      { name: "Structural Analysis", code: "CE-301", marks: 78, maxMarks: 100, attendance: 86, facultyName: "Dr. G. L. Rao" },
      { name: "Concrete Tech", code: "CE-302", marks: 82, maxMarks: 100, attendance: 84, facultyName: "Dr. G. L. Rao" },
      { name: "Geotechnical Engineering", code: "CE-303", marks: 74, maxMarks: 100, attendance: 85, facultyName: "Prof. S. K. Roy" },
      { name: "Transportation Engineering", code: "CE-304", marks: 80, maxMarks: 100, attendance: 85, facultyName: "Prof. S. K. Roy" }
    ],
    strengths: ["Reinforced Concrete Design", "BIM (Building Information Modeling)", "Site Surveying"],
    weaknesses: ["Geotechnical analytics math", "Hydrology equations"],
    technicalSkills: ["Revit", "AutoCAD", "ETABS", "STAAD Pro", "MS Project"],
    softSkills: ["Leadership on-site", "Coordination", "Negotiation"],
    extracurriculars: ["Civil Engineering Club President", "National Cadet Corps (NCC) Sergeant", "Wrestling"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "BIM Modeler / Structural Designer",
        probability: 88,
        status: "Highly Likely",
        reason: "Highly proficient in Revit and ETABS, with great structural analysis scores and real site survey experience.",
        missingSkills: ["Tekla Structures", "Dynamic earthquake loading analysis"],
        recommendedCertifications: ["Autodesk Certified Professional: Revit for Structural Design"]
      },
      {
        role: "Site Planning Engineer",
        probability: 82,
        status: "Highly Likely",
        reason: "Stellar organization, strong NCC training, and command over MS Project scheduling.",
        missingSkills: ["Primavera P6 tool"],
        recommendedCertifications: ["Project Management Professional (PMP) Basics"]
      }
    ]
  },
  {
    id: "STU2024009",
    name: "Ishita Roy",
    semester: 4,
    department: "Information Technology",
    email: "ishita.roy@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1558203728-00f45181dd84?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 71,
    cgpa: 5.8,
    historySGPA: [
      { semester: 1, sgpa: 6.8 },
      { semester: 2, sgpa: 6.1 },
      { semester: 3, sgpa: 5.5 }
    ],
    subjects: [
      { name: "Software Engineering", code: "IT-201", marks: 51, maxMarks: 100, attendance: 72, facultyName: "Prof. S. Sen" },
      { name: "Operating Systems", code: "IT-202", marks: 45, maxMarks: 100, attendance: 68, facultyName: "Dr. R. K. Bose" },
      { name: "Computer Networks", code: "IT-203", marks: 56, maxMarks: 100, attendance: 70, facultyName: "Dr. R. K. Bose" },
      { name: "Java Programming", code: "IT-204", marks: 62, maxMarks: 100, attendance: 74, facultyName: "Prof. S. Sen" }
    ],
    strengths: ["Creative Presentation", "Java Syntax Basics", "Blogging"],
    weaknesses: ["Operating Systems Kernels", "Subnet Routing Networks", "Software Testing Cycles"],
    technicalSkills: ["HTML", "CSS", "Java", "Canva", "MS PowerPoint"],
    softSkills: ["Patience", "Writing", "Graphic Design"],
    extracurriculars: ["Fine Arts Society Member", "Blogger & Content Creator"],
    isEligibleForPlacement: false,
    earlyWarningAlert: {
      type: "both",
      severity: "critical",
      details: "Critically low GPA (5.8) and cumulative attendance (71%). Failed the mid-term test of Operating Systems (45/100)."
    },
    placementPredictions: [
      {
        role: "Backend Software Developer",
        probability: 25,
        status: "Ineligible",
        reason: "Low aggregate CGPA (5.8) falls short of general placement eligibility. Serious gaps in networking and kernel architecture.",
        missingSkills: ["Data Structures & Algorithms", "OS Process Scheduling", "Database design", "System Design"],
        recommendedCertifications: ["Comprehensive Java Development Path on Coursera"]
      },
      {
        role: "Graphic/UI Designer",
        probability: 60,
        status: "Needs Skill Upgrade",
        reason: "Strong creative foundation in Canva and arts, but needs to master advanced prototyping tools and UI practices.",
        missingSkills: ["Figma", "Adobe Illustrator", "User Testing principles"],
        recommendedCertifications: ["Interaction Design UX Basics Certificate"]
      }
    ]
  },
  {
    id: "STU2024010",
    name: "Saurabh Negi",
    semester: 8,
    department: "Mechanical",
    email: "saurabh.negi@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 80,
    cgpa: 7.1,
    historySGPA: [
      { semester: 1, sgpa: 7.0 },
      { semester: 2, sgpa: 6.9 },
      { semester: 3, sgpa: 7.2 },
      { semester: 4, sgpa: 7.1 },
      { semester: 5, sgpa: 7.0 },
      { semester: 6, sgpa: 7.3 },
      { semester: 7, sgpa: 7.1 }
    ],
    subjects: [
      { name: "CAD/CAM", code: "ME-401", marks: 73, maxMarks: 100, attendance: 82, facultyName: "Dr. K. S. Murthy" },
      { name: "Fluid Dynamics", code: "ME-402", marks: 68, maxMarks: 100, attendance: 78, facultyName: "Dr. K. S. Murthy" },
      { name: "Finite Element Analysis", code: "ME-403", marks: 72, maxMarks: 100, attendance: 81, facultyName: "Prof. Anil Saxena" },
      { name: "Automobile Engineering", code: "ME-404", marks: 75, maxMarks: 100, attendance: 79, facultyName: "Prof. Anil Saxena" }
    ],
    strengths: ["Vehicle Mechanics", "Engine Overhauling", "Thermodynamics"],
    weaknesses: ["Computational Fluid Dynamics theory", "FEA Math modeling"],
    technicalSkills: ["AutoCAD", "MATLAB", "Python", "MS Excel"],
    softSkills: ["Hardworking", "Direct Communication", "Troubleshooting"],
    extracurriculars: ["Society of Automotive Engineers (SAE) Club Member", "Volleyball player"],
    isEligibleForPlacement: true,
    placementPredictions: [
      {
        role: "Production & Maintenance Engineer",
        probability: 80,
        status: "Highly Likely",
        reason: "Excellent mechanical diagnostic capability and engine overhauling projects, combined with solid core mechanical training.",
        missingSkills: ["Six Sigma methodologies", "Lean Manufacturing frameworks"],
        recommendedCertifications: ["Six Sigma Yellow Belt Certification"]
      },
      {
        role: "Automotive Simulation Analyst",
        probability: 58,
        status: "Needs Skill Upgrade",
        reason: "Passionate about cars, but requires deeper hands-on FEA and CFD project portfolios.",
        missingSkills: ["ANSYS fluent", "Solidworks Flow Simulation"],
        recommendedCertifications: ["Advanced CFD Analyst Masterclass"]
      }
    ]
  },
  {
    id: "STU2024011",
    name: "Nehal Sharma",
    semester: 2,
    department: "Computer Science",
    email: "nehal.s@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 95,
    cgpa: 9.4,
    historySGPA: [
      { semester: 1, sgpa: 9.4 }
    ],
    subjects: [
      { name: "Basic Electrical Eng", code: "EE-101", marks: 93, maxMarks: 100, attendance: 96, facultyName: "Dr. J. Paul" },
      { name: "Engineering Chemistry", code: "CY-101", marks: 95, maxMarks: 100, attendance: 94, facultyName: "Dr. Deepa Nair" },
      { name: "Introduction to Programming", code: "CS-101", marks: 97, maxMarks: 100, attendance: 95, facultyName: "Dr. Amit Verma" },
      { name: "Engineering Graphics", code: "CE-101", marks: 90, maxMarks: 100, attendance: 95, facultyName: "Dr. G. L. Rao" }
    ],
    strengths: ["C programming", "Inorganic chemistry", "Quick logical deductions"],
    weaknesses: ["Engineering graphics drafting", "Basic soldering labs"],
    technicalSkills: ["C", "HTML", "Python basics", "Visual Studio Code"],
    softSkills: ["Curiosity", "Self-motivation", "Analytical Reading"],
    extracurriculars: ["Chess Club Secretary", "Math Olympiad college nominee"],
    isEligibleForPlacement: false, // Too early (Semester 2)
    placementPredictions: [
      {
        role: "Software Developer Intern",
        probability: 92,
        status: "Highly Likely",
        reason: "Stellar logical ability, perfect grade in C programming, CGPA of 9.4 in early stages.",
        missingSkills: ["Object-Oriented Programming (OOP) in C++/Java", "DSA core concepts"],
        recommendedCertifications: ["NPTEL Programming in C++ Course Certification"]
      }
    ]
  },
  {
    id: "STU2024012",
    name: "Pawan Kalyan",
    semester: 6,
    department: "Civil",
    email: "pawan.k@student.college.edu",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    attendanceRate: 77,
    cgpa: 6.9,
    historySGPA: [
      { semester: 1, sgpa: 7.1 },
      { semester: 2, sgpa: 6.8 },
      { semester: 3, sgpa: 6.5 },
      { semester: 4, sgpa: 7.0 },
      { semester: 5, sgpa: 7.1 }
    ],
    subjects: [
      { name: "Structural Analysis", code: "CE-301", marks: 62, maxMarks: 100, attendance: 76, facultyName: "Dr. G. L. Rao" },
      { name: "Concrete Tech", code: "CE-302", marks: 71, maxMarks: 100, attendance: 78, facultyName: "Dr. G. L. Rao" },
      { name: "Geotechnical Engineering", code: "CE-303", marks: 65, maxMarks: 100, attendance: 77, facultyName: "Prof. S. K. Roy" },
      { name: "Transportation Engineering", code: "CE-304", marks: 69, maxMarks: 100, attendance: 77, facultyName: "Prof. S. K. Roy" }
    ],
    strengths: ["Surveying", "Geographical mapping", "Drafting layouts"],
    weaknesses: ["High-rise concrete calculations", "Structural steel math"],
    technicalSkills: ["AutoCAD", "QGIS", "Excel"],
    softSkills: ["Patience", "Work ethic", "Field execution coordination"],
    extracurriculars: ["Social Service League Volunteer", "NSS Club coordinator", "Photography"],
    isEligibleForPlacement: true,
    earlyWarningAlert: {
      type: "academic",
      severity: "warning",
      details: "CGPA (6.9) is borderline for top-tier civil engineering placements (normally requires 7.0+). SA-1 marks are low."
    },
    placementPredictions: [
      {
        role: "GIS Analyst & Surveyor",
        probability: 75,
        status: "Eligible with Prep",
        reason: "Excellent layout drafting and geological mapping, coupled with outstanding QGIS skill and field surveyor attitude.",
        missingSkills: ["ArcGIS advanced features", "Remote Sensing fundamentals"],
        recommendedCertifications: ["Coursera GIS Specialization by UC Davis"]
      },
      {
        role: "Structural Engineering Designer",
        probability: 45,
        status: "Needs Skill Upgrade",
        reason: "Requires deeper structural analysis math foundations and training in modern design packages like STAAD Pro.",
        missingSkills: ["STAAD Pro", "ETABS software", "Seismic Load equations"],
        recommendedCertifications: ["Structural Steel Designer Training Badge"]
      }
    ]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "ALT001",
    studentId: "STU2024003",
    studentName: "Rohan Das",
    department: "Computer Science",
    type: "attendance",
    severity: "critical",
    message: "Attendance dropped to 68% (required: 75%)",
    date: "2026-06-24",
    status: "active"
  },
  {
    id: "ALT002",
    studentId: "STU2024003",
    studentName: "Rohan Das",
    department: "Computer Science",
    type: "academic",
    severity: "critical",
    message: "Failing CS-301 mid-term (54/100) and CS-306 (49/100)",
    date: "2026-06-25",
    status: "active"
  },
  {
    id: "ALT003",
    studentId: "STU2024009",
    studentName: "Ishita Roy",
    department: "Information Technology",
    type: "academic",
    severity: "critical",
    message: "Operating Systems (IT-202) midterm exam failed (45/100)",
    date: "2026-06-25",
    status: "active"
  },
  {
    id: "ALT004",
    studentId: "STU2024005",
    studentName: "Kabir Malhotra",
    department: "Electronics",
    type: "attendance",
    severity: "warning",
    message: "Attendance borderline at 74% in EC-304 (Digital Signal Processing)",
    date: "2026-06-26",
    status: "active"
  },
  {
    id: "ALT005",
    studentId: "STU2024012",
    studentName: "Pawan Kalyan",
    department: "Civil",
    type: "academic",
    severity: "warning",
    message: "Structural Analysis (CE-301) mid-term score (62/100) is below class median",
    date: "2026-06-26",
    status: "active"
  }
];
