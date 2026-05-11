import { Router, Request, Response } from "express";
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
        const skills = await this.skillService.list();
        res.json(skills);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch skills" });
      }
    });

    // GET /api/skills/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const skill = await this.skillService.getById(id);
        res.json(skill);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch skill" });
      }
    });

    // POST /api/skills
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const skill = await this.skillService.create(req.body);
        res.status(201).json(skill);
      } catch (error) {
        res.status(500).json({ error: "Failed to create skill" });
      }
    });

    // PUT /api/skills/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const updated = await this.skillService.update(id, req.body);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update skill" });
      }
    });

    // DELETE /api/skills/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        await this.skillService.delete(id);
        res.json({ message: "Skill deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete skill" });
      }
    });

    // POST /api/skills/:skillId/jobs/:jobId
    this.router.post("/:skillId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const skillId = getString(req.params.skillId);
        await this.skillService.attachToApplication(req.userId!, jobId, skillId);
        res.json({ message: "Skill attached to job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to attach skill to job" });
      }
    });

    // DELETE /api/skills/:skillId/jobs/:jobId
    this.router.delete("/:skillId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const skillId = getString(req.params.skillId);
        await this.skillService.detachFromApplication(req.userId!, jobId, skillId);
        res.json({ message: "Skill detached from job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to detach skill from job" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
