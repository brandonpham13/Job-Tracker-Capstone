import { Router, type Request, type Response } from "express";
import { SkillService } from "../services/skill.js";
import { getString } from "../utils/typeHelpers.js";

export class SkillRouter {
  router: Router;

  constructor(private skillService: SkillService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /api/skills
    this.router.get("/", async (_req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const skills = await this.skillService.list();
        res.json(skills);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch skills";
        res.status(500).json({ error: message });
      }
    });

    // GET /api/skills/frequency/:userId (get frequency stats for user)
    this.router.get("/frequency/:userId", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.params.userId);
        const stats = await this.skillService.getFrequencyStats(userId);
        res.json(stats);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch skill frequency stats";
        res.status(500).json({ error: message });
      }
    });

    // GET /api/skills/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const skill = await this.skillService.getById(id);
        if (!skill) {
          return res.status(404).json({ error: "Skill not found" });
        }
        res.json(skill);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch skill";
        res.status(500).json({ error: message });
      }
    });

    // POST /api/skills
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const { skill_name, category } = req.body;
        const skill = await this.skillService.create({ skill_name, category: category ?? null });
        res.status(201).json(skill);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create skill";
        res.status(400).json({ error: message });
      }
    });

    // PUT /api/skills/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const { skill_name, category } = req.body;
        const updated = await this.skillService.update(id, { skill_name, category: category ?? null });
        res.json(updated);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update skill";
        res.status(500).json({ error: message });
      }
    });

    // DELETE /api/skills/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        await this.skillService.delete(id);
        res.json({ message: "Skill deleted" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete skill";
        res.status(500).json({ error: message });
      }
    });

    // POST /api/skills/:skillId/jobs/:jobId
    this.router.post("/:skillId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const skillId = getString(req.params.skillId);
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }
        await this.skillService.attachToApplication(userId, appId, skillId);
        res.json({ message: "Skill attached to application" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to attach skill to application";
        res.status(500).json({ error: message });
      }
    });

    // DELETE /api/skills/:skillId/jobs/:jobId
    this.router.delete("/:skillId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const skillId = getString(req.params.skillId);
        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }
        await this.skillService.detachFromApplication(userId, appId, skillId);
        res.json({ message: "Skill detached from application" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to detach skill from application";
        res.status(500).json({ error: message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
