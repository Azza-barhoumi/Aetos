import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

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
