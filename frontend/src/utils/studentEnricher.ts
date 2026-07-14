import { Student } from "../types";

export interface EnrichedStudent extends Student {
  projects: { title: string; techStack: string[]; description: string }[];
  certifications: string[];
  internships: { company: string; role: string; duration: string; description: string }[];
  codingProfiles: { platform: string; rating: string; solved: number; url?: string }[];
  assignmentCompletion: number;
}

export function enrichStudent(student: Student | null | undefined): EnrichedStudent | null {
  if (!student) {
    return null;
  }

  const department = student.department || "Computer Science";
  
  let projects = [
    {
      title: "Enterprise Inventory Optimization Suite",
      techStack: ["Node.js", "React", "PostgreSQL", "Docker"],
      description: "Designed a secure client-server platform optimized for low latency under high concurrency. Implemented token-based authentication and visual charts representing real-time telemetry."
    },
    {
      title: "Predictive Analytics Engine",
      techStack: ["Python", "scikit-learn", "Pandas", "Flask"],
      description: "Implemented a custom regression model analyzing historical academic scorecards. Integrated clean data ingestion layers with graceful error logging."
    }
  ];

  let certifications = [
    "AWS Certified Solutions Architect (Associate)",
    "Google Data Analytics Professional",
    "Meta Front-End Developer Specialization"
  ];

  let internships = [
    {
      company: "Cognitive Tech Solutions",
      role: "Software Engineering Intern",
      duration: "Jan 2026 - Apr 2026 (4 months)",
      description: "Refactored legacy API routes into modular controllers. Improved loading speeds by 24% using strategic query memoization."
    }
  ];

  let codingProfiles = [
    { platform: "LeetCode", rating: "1680 (Top 15%)", solved: 185 },
    { platform: "GeeksforGeeks", rating: "4 Star", solved: 120 }
  ];

  let assignmentCompletion = 92;

  // Department-specific overrides
  if (department === "Electronics") {
    projects = [
      {
        title: "RTOS-Enabled Industrial Climate Sensor Network",
        techStack: ["Embedded C", "FreeRTOS", "STM32 Nucleo", "PCB Design"],
        description: "Programmed a multi-threaded sensor polling engine with low jitter. Developed schematic diagrams in KiCad with ground plane isolates."
      },
      {
        title: "Digital Audio Synthesizer & Filter",
        techStack: ["MATLAB", "ARM Assembly", "DSP Logic"],
        description: "Engineered a recursive infinite-impulse-response bandpass filter. Optimized processing delays to 1.2ms using inline hardware registers."
      }
    ];
    certifications = [
      "Arm Education Embedded Technologies Certificate",
      "MATLAB Certified Associate Developer"
    ];
    internships = [
      {
        company: "Veda Semiconductor",
        role: "Silicon Validation Intern",
        duration: "Dec 2025 - Mar 2026 (4 months)",
        description: "Assisted in running post-silicon simulation checks on ARM Cortex modules. Drafted test report summaries."
      }
    ];
    codingProfiles = [
      { platform: "Hackerrank", rating: "Gold Badge in Problem Solving", solved: 140 }
    ];
    assignmentCompletion = 88;
  } else if (department === "Mechanical") {
    projects = [
      {
        title: "DFMEA Redesign of FSAE Braking Assembly",
        techStack: ["SolidWorks", "ANSYS Structural", "GD&T Standards"],
        description: "Modeled critical rotor ventilation paths, reducing maximum heat loading by 15% during braking cycle. Complied with strict SAE safety codes."
      },
      {
        title: "Automated Material Sorter PLC Program",
        techStack: ["Ladder Logic", "Siemens S7-1200", "Sensors Calibration"],
        description: "Configured photoelectric sensors and conveyor speed control loops for high-accuracy sorting. Decreased recycle waste by 11%."
      }
    ];
    certifications = [
      "Certified SOLIDWORKS Professional (CSWP)",
      "Six Sigma Yellow Belt Certification"
    ];
    internships = [
      {
        company: "Hind-Motors Automotive",
        role: "Production & QC Intern",
        duration: "Jan 2026 - Mar 2026 (3 months)",
        description: "Monitored crankshaft tolerances using electronic micrometer indicators. Documented statistical process charts."
      }
    ];
    codingProfiles = [
      { platform: "AutoDesk Portal", rating: "Certified Modeler", solved: 45 }
    ];
    assignmentCompletion = 90;
  } else if (department === "Civil") {
    projects = [
      {
        title: "Structural Safety Assessment of Multi-Storey RCC Frame",
        techStack: ["STAAD Pro", "Revit Structural", "IS 456 Guidelines"],
        description: "Conducted finite element model structural simulation on 12-storey commercial buildings. Documented maximum wind shear reactions."
      },
      {
        title: "Hydrological Flow Simulator for Catchment Area",
        techStack: ["EPANET", "GIS Mapping", "Excel VBA"],
        description: "Mapped pipeline velocity rates and pressure drops. Identified three pipe sections prone to high surge pressure during peak load."
      }
    ];
    certifications = [
      "Bentley STAAD.Pro Certified Structural Engineer",
      "Autodesk Certified Professional: Revit for Structural Design"
    ];
    internships = [
      {
        company: "BuildCorp Infrastructure",
        role: "Assistant Construction Site Intern",
        duration: "Jan 2026 - Apr 2026 (4 months)",
        description: "Supervised concrete batch quality and reinforcement spacings. Assisted in reading shop drawings."
      }
    ];
    codingProfiles = [
      { platform: "Bentley Community", rating: "Active Engineer", solved: 30 }
    ];
    assignmentCompletion = 94;
  }

  // Adjust ratings and solved values based on student GPA
  const cgpa = student.cgpa || 7.5;
  const attendance = student.attendanceRate || 80;
  const multiplier = cgpa / 9.0;
  codingProfiles = codingProfiles.map(p => ({
    ...p,
    solved: Math.max(10, Math.floor(p.solved * multiplier))
  }));
  assignmentCompletion = Math.min(100, Math.floor(assignmentCompletion * (attendance / 90)));

  return {
    ...student,
    // Ensure all arrays have defaults
    projects: projects || [],
    certifications: certifications || [],
    internships: internships || [],
    codingProfiles: codingProfiles || [],
    technicalSkills: student.technicalSkills || [],
    softSkills: student.softSkills || [],
    strengths: student.strengths || [],
    weaknesses: student.weaknesses || [],
    subjects: student.subjects || [],
    extracurriculars: student.extracurriculars || [],
    historySGPA: student.historySGPA || [],
    placementPredictions: student.placementPredictions || [],
    assignmentCompletion
  };
}
