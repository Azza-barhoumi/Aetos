import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // 1. Career Passport API (B2B)
  app.get("/api/v2/career-passport/:userId", async (req, res) => {
    // In a real production app, we would verify the B2B token here.
    // For the blueprint, we return a mock structured passport based on the ID.
    const { userId } = req.params;
    const jobId = req.query.job_id;

    res.json({
      status: "success",
      passport: {
        userId,
        anonymizedId: `A-ECHO-${userId.substring(0, 4)}`,
        verifiedSkills: [
          { name: "Strategic Thinking", provenance: "Aetos Inference v1" },
          { name: "Python", provenance: "CV Verification" }
        ],
        zScore: 89.5,
        targetJobId: jobId || "unspecified",
        personaGlimpse: {
          processingDepth: 0.92,
          innovationDrive: 0.85
        }
      }
    });
  });

  // 2. CV Loom - Semantic Optimization (Backend for security/API key isolation)
  app.post("/api/cv-loom/optimize", async (req, res) => {
    const { cvText, jobDescription } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are the Aetos Ingestion Protocol. 
        TASK: Semantically align the provided CV to the Target Job Description.
        RULES:
        1. STRATEGY: Do not just list skills. Explain how the candidate's specific "Echo" (their behavioral patterns) fits this specific role.
        2. STORYTELLING: Use the Aetos brand voice (intriguing, high-fidelity, cognitive).
        3. OUTPUT: Return plain text markdown that the user can use for their resume.

        CV:
        ${cvText}

        TARGET JOB:
        ${jobDescription}
      `;

      const result = await model.generateContent(prompt);
      res.json({ optimizedCv: result.response.text() });
    } catch (error) {
      console.error("CV Loom Error:", error);
      res.status(500).json({ error: "Failed to optimize CV" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aetos Protocol running on http://localhost:${PORT}`);
  });
}

startServer();
