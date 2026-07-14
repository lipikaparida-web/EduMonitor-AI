import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = 3000;
const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

app.use(express.json());

// Initialize Gemini SDK lazily to prevent startup crashes if key is missing in other environments
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to offline mock generators.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Reverse proxy: Forward FastAPI routes to the Python backend
const PROXY_ROUTES = [
  "/auth",
  "/students",
  "/student",
  "/faculty",
  "/dashboard",
  "/placements",
  "/placement",
  "/erp",
];

const fastApiProxy = createProxyMiddleware({
  target: FASTAPI_URL,
  changeOrigin: true,
  on: {
    error: (err: any, req: any, res: any) => {
      console.error("[Proxy Error]", err.message);
      (res as any).status(502).json({ detail: "FastAPI backend is not running. Start it with: uvicorn app:app --port 8000" });
    },
  },
});

for (const route of PROXY_ROUTES) {
  app.use(route, fastApiProxy);
}

// API: Gemini Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Offline fallback when API key is missing
      return res.json({
        text: `[OFFLINE FALLBACK MODE - No GEMINI_API_KEY set] I received your question: "${message}". In full production with an API key, I will analyze this against our student records (${context?.subject || "general"}). Let's check some student stats: Average GPA is 8.0, and 3 students have active attendance alerts. Let me know if you need specific mock student reports!`,
      });
    }

    const contextStr = context ? `Context Academic Data:\n${JSON.stringify(context, null, 2)}` : "";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        {
          role: "user",
          parts: [{ text: `${contextStr}\n\nUser Question: ${message}` }],
        },
      ],
      config: {
        systemInstruction: `You are EduMonitor AI, an expert academic advisor, registrar, and placement counselor for a professional engineering college.
You have deep knowledge of student performance analytics, grading scales, early intervention metrics, and corporate hiring criteria.
Provide highly professional, structured, objective, and actionable responses. Suggest clear corrective steps (remedial material, faculty intervention), or construct detailed job preparation guidance (skills to learn, project ideas, certifications).
Speak in a supportive, educational, and professional voice. Do not include markdown headers that look messy; use clean bullets or paragraphs.`,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI chat response." });
  }
});

// API: Gemini Student Performance Report Generator
app.post("/api/gemini/report", async (req, res) => {
  try {
    const { student } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Offline fallback
      return res.json({
        report: `## AI Performance Assessment for ${student.name} (Offline Fallback)
This report was generated in offline mode. 
- **Academic Standing**: CGPA: ${student.cgpa}. Attendance is ${student.attendanceRate}%.
- **Key Recommendation**: Improve marks in ${student.weaknesses.join(", ") || "weak areas"}.
- **Tech Alignment**: Highly suited for engineering roles utilizing ${student.technicalSkills.join(", ")}.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a comprehensive Academic Performance & Intervention Report for this student:
${JSON.stringify(student, null, 2)}`,
      config: {
        systemInstruction: `You are EduMonitor AI, an academic auditor.
Generate a structured report containing:
1. EXECUTIVE SUMMARY: A high-level overview of the student's status, identifying if they are stable, borderline, or in critical need of help.
2. ACADEMIC GAP ANALYSIS: Specific assessment of their weaknesses (particularly in subjects with scores below 75) and why they might be struggling.
3. SKILLS INVENTORY & TECH STRENGTHS: Analysis of how their tech skills match their current semester standing.
4. EARLY WARNING RECOMMENDATIONS: Actionable strategies for faculty and student to overcome gaps (attendance or grades).
5. STUDY PLAN ROADMAP: A 4-week step-by-step remedial guide with specific technical and academic goals.

Use professional, encouraging, and clear markdown with distinct sections.`,
      },
    });

    res.json({ report: response.text });
  } catch (error: any) {
    console.error("Gemini Report API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI student report." });
  }
});

// API: Gemini Placement Readiness and Job Fit Predictor
app.post("/api/gemini/placement", async (req, res) => {
  try {
    const { student, targetJobRole, jobDescription } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        prediction: `### Placement Analysis for ${student.name} (Offline Fallback)
- **Target Role**: ${targetJobRole}
- **Placement Compatibility**: Strong alignment with student's current skill set.
- **Recommended Action**: Complete a major project in this technology and take mock coding tests.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Evaluate this student's readiness and match for the target role "${targetJobRole}" ${
        jobDescription ? `with Job Description:\n${jobDescription}` : ""
      }.
Student Profile:
${JSON.stringify(student, null, 2)}`,
      config: {
        systemInstruction: `You are EduMonitor AI's Career Placement Director.
Analyze the student's CGPA, technical skills, soft skills, and extracurriculars against the target role.
Generate a response with the following sections in markdown:
1. FITMENT RATING & PERCENTAGE: A clear match percentage (e.g. 85%) and rating (Highly Match, Good Fit, Skills Gap, Not Eligible).
2. CRITICAL MATCHES: What the student possesses that matches this role perfectly.
3. SKILLS GAP DETECTED: What specific technical skills, tools, or concepts from the job are missing from their profile.
4. ROADMAP TO ELIGIBILITY: Step-by-step certifications, courses, projects, or prep needed (DSA, System Design, etc.) to land this exact role.
5. INTERVIEW PREPARATION TIPS: 3 custom-crafted mock interview questions (with ideal answer guidelines) tailored for this student.

Be objective, encouraging, and highly specific to their real technical skills (e.g., if they know React, mention front-end engineering; if their CGPA is low, warn them about recruiter screening cutoffs).`,
      },
    });

    res.json({ prediction: response.text });
  } catch (error: any) {
    console.error("Gemini Placement API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI placement predictions." });
  }
});

// API: Resume Evaluation Endpoint
app.post("/api/gemini/resume-eval", async (req, res) => {
  try {
    const { student, resumeText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const score = Math.min(95, Math.max(55, Math.floor(70 + (student.cgpa - 7) * 10 + (student.technicalSkills.length * 1.5))));
      const rating = score >= 85 ? "Excellent" : score >= 75 ? "Good" : "Needs Polish";
      
      const missingKeywordsMap: Record<string, string[]> = {
        "Computer Science": ["System Design", "Microservices", "Redis", "Docker", "Kubernetes", "CI/CD"],
        "Information Technology": ["Cloud Security", "AWS Architecture", "NoSQL Databases", "GraphQL"],
        "Electronics": ["RTOS", "Verilog", "FPGA Programming", "PCB Design", "ARM Cortex"],
        "Mechanical": ["GD&T Standards", "Ansys Fluent", "Computational Fluid Dynamics", "Lean Manufacturing"],
        "Civil": ["Primavera P6", "Structural BIM", "Tekla Structures", "STAAD Pro Foundations"]
      };

      const missingKeywords = missingKeywordsMap[student.department] || ["Advanced Industry Standards", "System Workflows"];
      const missingProjects = [
        `Develop a major hands-on project utilizing ${missingKeywords[0] || "industry standard technologies"} and ${missingKeywords[1] || "modern frameworks"}.`,
        `Build an end-to-end simulation or full-stack application centered on real-world industrial specifications for ${student.department}.`
      ];

      return res.json({
        atsScore: score,
        strength: `The candidate possesses excellent academic standing in ${student.department} with a CGPA of ${student.cgpa}. They exhibit strong foundational skills in ${student.technicalSkills.slice(0, 3).join(", ")} and show active participation in activities like ${student.extracurriculars[0] || "technical societies"}.`,
        missingKeywords,
        missingProjects,
        grammarSuggestions: [
          "Use strong action verbs like 'Engineered', 'Optimized', or 'Orchestrated' to begin every bullet point rather than passive phrases.",
          "Quantify achievements (e.g. 'Boosted efficiency by 22%' or 'Reduced query latency by 40%') to increase ATS rating."
        ],
        formattingImprovements: [
          "Ensure your contact details, GitHub, and LinkedIn links are in a clear single-line header at the top.",
          "Add a dedicated 'Technical Skills' grid grouped by categories (Languages, Frameworks, Developer Tools) for better scanning."
        ],
        technicalSkillRecommendations: [
          `Acquire proficiency in ${missingKeywords[0] || "advanced standards"} to align with current entry-level job descriptions.`,
          "Obtain an industry-recognized vendor certification to validate your core expertise."
        ],
        rating
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this student resume/profile and evaluate it against standard ATS systems for technical positions.
      Student Profile: ${JSON.stringify(student, null, 2)}
      Resume Text Provided: ${resumeText || "No text provided, evaluate their student profile description directly."}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER },
            strength: { type: Type.STRING },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammarSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            formattingImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalSkillRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            rating: { type: Type.STRING }
          },
          required: ["atsScore", "strength", "missingKeywords", "missingProjects", "grammarSuggestions", "formattingImprovements", "technicalSkillRecommendations", "rating"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Resume Eval API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI resume evaluation." });
  }
});

// API: Interview Preparation Endpoint
app.post("/api/gemini/interview-prep", async (req, res) => {
  try {
    const { student, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Mock interview questions based on student profile and role
      const questions = [
        {
          category: "Technical",
          question: `Can you describe how you would design and implement a system utilizing ${student.technicalSkills[0] || "your core skills"}?`,
          answer: `I would start by designing a clean separation of concerns, choosing suitable data models, and optimizing queries. For example, using ${student.technicalSkills[0] || "the technology"} I would structure my components modularly to avoid bottleneck issues, ensuring high-concurrency capability.`,
          difficulty: "Medium",
          feedback: "Focus on articulating your architectural decision process and mention any projects where you faced performance bottlenecks."
        },
        {
          category: "SQL",
          question: "What is the difference between JOIN and LEFT JOIN, and how do you optimize a query with multiple JOINs?",
          answer: "JOIN (or INNER JOIN) returns records with matching values in both tables, whereas LEFT JOIN returns all records from the left table and matched records from the right. Query optimization can be achieved by indexing foreign keys, avoiding SELECT *, and analyzing query execution plans.",
          difficulty: "Medium",
          feedback: "Perfect. Mention indexing strategy and EXPLAIN ANALYZE command specifically."
        },
        {
          category: "Coding",
          question: "How would you reverse a linked list in-place? Explain the time and space complexity.",
          answer: "By keeping track of three pointers (prev, current, and next), we can traverse the list once and flip the links. Time complexity is O(N) where N is the length, and space complexity is O(1) as we are only updating references.",
          difficulty: "Hard",
          feedback: "Illustrate pointer updates step-by-step. Keep in mind edge cases like empty lists or a list with only one node."
        },
        {
          category: "HR",
          question: "Where do you see yourself in 5 years, and how does our company fit into that roadmap?",
          answer: "In five years, I aim to have mastered building large-scale, production-ready systems, and transitioned into a technical lead or mentor role. Your company's engineering culture and focus on high-impact solutions align perfectly with my aspirations to tackle complex problems at scale.",
          difficulty: "Easy",
          feedback: "Be confident and show that you've researched the company's core values."
        },
        {
          category: "Behavioral",
          question: `Tell me about a time you had to resolve a conflict or lead a team, perhaps during your work as a ${student.extracurriculars[0] || "student leader"}.`,
          answer: `When organizing a major event, we faced a tight deadline and differing opinions on the implementation path. I set up a brief sync, established a objective decision matrix based on constraints, assigned ownership clearly, and we successfully delivered on time.`,
          difficulty: "Medium",
          feedback: "Use the STAR method (Situation, Task, Action, Result) to keep your narrative structured and impact-focused."
        }
      ];

      return res.json({ questions });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate customized interview preparation questions with ideal model answers, difficulty levels, and improvement feedback for this student profile:
      Student Profile: ${JSON.stringify(student, null, 2)}
      Target Role: ${targetRole}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "One of: HR, Technical, SQL, Coding, Behavioral" },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING, description: "A detailed, professional model answer to the question" },
                  difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                  feedback: { type: Type.STRING, description: "Actionable improvement suggestion for how the student can articulate this answer" }
                },
                required: ["category", "question", "answer", "difficulty", "feedback"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Interview Prep API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI interview questions." });
  }
});

// API: Company Recommendations Endpoint
app.post("/api/gemini/company-recs", async (req, res) => {
  try {
    const { student } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Mock companies matching department and score
      let companies = [];
      const eligibility = `CGPA > ${student.cgpa >= 8 ? "7.5" : "6.0"}, Active Attendance, No backlogs`;
      
      if (student.department === "Computer Science" || student.department === "Information Technology") {
        companies = [
          {
            name: "Google India",
            eligibility: "CGPA > 8.5, strong DSA proficiency, coding portfolio",
            requiredSkills: ["C++ or Java", "System Design", "Data Structures", "Algorithms"],
            hiringPattern: "Online Coding Test -> 3 Technical Rounds -> Googleyness & Leadership Round",
            interviewProcess: "Rigorous focus on core problem-solving, logic, and complexity analysis.",
            salaryPackage: "22 - 35 LPA",
            successProbability: student.cgpa >= 9 ? 85 : student.cgpa >= 8 ? 60 : 35
          },
          {
            name: "Stripe",
            eligibility: "CGPA > 8.0, fullstack projects, API design knowledge",
            requiredSkills: ["Ruby/Python/Node", "React", "REST APIs", "System Integration"],
            hiringPattern: "Resume Screen -> Technical Phone Screen -> Full-day Virtual Onsite (4 rounds)",
            interviewProcess: "Deep practical coding assessment, building and debugging live systems.",
            salaryPackage: "18 - 28 LPA",
            successProbability: student.cgpa >= 8.5 && student.technicalSkills.includes("React") ? 80 : 50
          },
          {
            name: "Infosys (Power Programmer)",
            eligibility: "CGPA > 6.5, good coding foundation",
            requiredSkills: ["Java", "Python", "SQL", "HTML/CSS"],
            hiringPattern: "InfyTQ Exam / HackWithInfy Hackathon -> Technical Interview -> HR Round",
            interviewProcess: "Focus on OOPs concepts, database queries, and basic algorithms.",
            salaryPackage: "6.5 - 9.5 LPA",
            successProbability: student.cgpa >= 7.0 ? 95 : 75
          },
          {
            name: "Tata Consultancy Services (TCS Digital)",
            eligibility: "CGPA > 6.0, no active backlogs",
            requiredSkills: ["C/C++", "Java/Python", "SQL Foundations"],
            hiringPattern: "TCS NQT National Qualifier Test -> Coding Round -> Face-to-Face Technical & HR",
            interviewProcess: "Broad coverage of computer fundamentals, project explanation, and behavioral check.",
            salaryPackage: "7.0 - 8.2 LPA",
            successProbability: student.cgpa >= 6.5 ? 98 : 80
          }
        ];
      } else if (student.department === "Electronics") {
        companies = [
          {
            name: "Texas Instruments",
            eligibility: "CGPA > 8.0, microcontrollers expertise, circuit simulation",
            requiredSkills: ["Embedded C", "Microprocessor Architecture", "Verilog", "Analog Design"],
            hiringPattern: "Written Tech Test -> Core Technical Interview 1 & 2 -> HR Round",
            interviewProcess: "Heavy focus on basic circuit analysis, hardware programming, and logic design.",
            salaryPackage: "15 - 22 LPA",
            successProbability: student.cgpa >= 8.0 ? 80 : 50
          },
          {
            name: "Intel Corporation",
            eligibility: "CGPA > 7.5, hardware validation basics",
            requiredSkills: ["C/C++", "Verilog/VHDL", "Python scripting", "Computer Architecture"],
            hiringPattern: "Technical Quiz -> Core Circuit Design Round -> System Architecture Check -> HR",
            interviewProcess: "Evaluates CPU pipeline design, cache structures, and hardware descriptions.",
            salaryPackage: "12 - 18 LPA",
            successProbability: student.cgpa >= 7.5 ? 85 : 55
          },
          {
            name: "Cognizant (Digital Engineering)",
            eligibility: "CGPA > 6.0, general coding capability",
            requiredSkills: ["Python or C++", "Database Basics", "Analytical Thinking"],
            hiringPattern: "Aptitude Exam -> Tech Interview -> HR Sign-off",
            interviewProcess: "Evaluates logic, willingness to learn cloud/IT, and communication skills.",
            salaryPackage: "4.5 - 6.5 LPA",
            successProbability: student.cgpa >= 7.0 ? 95 : 80
          }
        ];
      } else if (student.department === "Mechanical") {
        companies = [
          {
            name: "Tata Motors Ltd",
            eligibility: "CGPA > 7.0, AutoCAD/SolidWorks knowledge, vehicle diagnostics",
            requiredSkills: ["SolidWorks/ANSYS", "Thermodynamics", "Materials Science", "DFMEA"],
            hiringPattern: "Cognitive & Technical Test -> Group Discussion -> Panel Technical Interview -> HR",
            interviewProcess: "Practical automobile questions, manufacturing processes, and design standards.",
            salaryPackage: "8.5 - 12 LPA",
            successProbability: student.cgpa >= 7.5 ? 90 : 70
          },
          {
            name: "Mahindra & Mahindra",
            eligibility: "CGPA > 7.0, manufacturing processes",
            requiredSkills: ["AutoCAD", "Finite Element Analysis", "Manufacturing Tech", "GD&T"],
            hiringPattern: "Aptitude & Domain Test -> Core Technical Panel -> HR Round",
            interviewProcess: "Evaluates strength of materials, powertrain systems, and shopfloor concepts.",
            salaryPackage: "8.0 - 11.5 LPA",
            successProbability: student.cgpa >= 7.2 ? 88 : 65
          },
          {
            name: "Larsen & Toubro (Heavy Engineering)",
            eligibility: "CGPA > 6.5, structural mechanics base",
            requiredSkills: ["AutoCAD", "Statics & Dynamics", "Project Management"],
            hiringPattern: "L&T Online Test -> Face-to-Face Technical -> Managerial & HR Round",
            interviewProcess: "Broad mechanical engineering fundamentals, fluid mechanics, and stress analysis.",
            salaryPackage: "6.0 - 8.5 LPA",
            successProbability: student.cgpa >= 7.0 ? 92 : 75
          }
        ];
      } else { // Civil
        companies = [
          {
            name: "Larsen & Toubro (L&T Construction)",
            eligibility: "CGPA > 7.0, STAAD Pro / Revit knowledge",
            requiredSkills: ["STAAD Pro", "Concrete Technology", "Structural Analysis", "Project Scheduling"],
            hiringPattern: "All-India Online Test -> Core Technical Interview -> HR Managerial Panel",
            interviewProcess: "Focus on design of concrete structures, foundation engineering, and surveying.",
            salaryPackage: "6.5 - 9.0 LPA",
            successProbability: student.cgpa >= 7.5 ? 90 : 70
          },
          {
            name: "Tata Projects",
            eligibility: "CGPA > 7.0, site execution skills",
            requiredSkills: ["AutoCAD", "Geotechnical Engineering", "Estimation & Costing"],
            hiringPattern: "Aptitude Round -> Technical Panel -> Site Management Check -> HR",
            interviewProcess: "Reviews concrete mixes, testing procedures, project timeline management, and safety.",
            salaryPackage: "5.8 - 8.2 LPA",
            successProbability: student.cgpa >= 7.0 ? 85 : 60
          },
          {
            name: "Afcons Infrastructure",
            eligibility: "CGPA > 6.5, structural base",
            requiredSkills: ["Surveying", "Structural Design", "Quantity Surveying"],
            hiringPattern: "Technical Test -> F2F Domain Interview -> HR Validation",
            interviewProcess: "Core topics like hydrology, road designs, concrete strengths, and soil bearing capacity.",
            salaryPackage: "5.5 - 7.5 LPA",
            successProbability: student.cgpa >= 6.8 ? 90 : 75
          }
        ];
      }

      return res.json({ companies });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Based on this student's department, CGPA, and technical/soft skills, recommend 4 real companies that hire for their profile, including hiring patterns, eligibility, average salary package, and placement success probability.
      Student Profile: ${JSON.stringify(student, null, 2)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  eligibility: { type: Type.STRING, description: "e.g. 'CGPA > 8.0, No active backlogs'" },
                  requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  hiringPattern: { type: Type.STRING, description: "e.g. 'Online Aptitude Test -> Technical Coding -> HR Interview'" },
                  interviewProcess: { type: Type.STRING },
                  salaryPackage: { type: Type.STRING, description: "Average CTC, e.g. '12 LPA' or '8.5 LPA'" },
                  successProbability: { type: Type.INTEGER, description: "Match probability, e.g., 85 for 85%" }
                },
                required: ["name", "eligibility", "requiredSkills", "hiringPattern", "interviewProcess", "salaryPackage", "successProbability"]
              }
            }
          },
          required: ["companies"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Company Recs API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI company recommendations." });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
