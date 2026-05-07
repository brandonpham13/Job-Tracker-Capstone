import { Router, Request, Response } from "express";
import { JobService } from "../services/job.js";
import { getString } from "../utils/typeHelpers.js";

export class JobRouter {
  router: Router;

  constructor(private jobService: JobService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /api/jobs?userId=...
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const jobs = await this.jobService.list(userId);
        res.json(jobs);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs" });
      }
    });

    // GET /api/jobs/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);
        const job = await this.jobService.getById(userId, id);
        res.json(job);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch job" });
      }
    });

    // POST /api/jobs
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const job = await this.jobService.create(userId, req.body);
        res.status(201).json(job);
      } catch (error) {
        res.status(500).json({ error: "Failed to create job" });
      }
    });

    // PUT /api/jobs/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const id = getString(req.params.id);
        const updated = await this.jobService.update(userId, id, req.body);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update job" });
      }
    });

    // DELETE /api/jobs/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);
        await this.jobService.delete(userId, id);
        res.json({ message: "Job deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete job" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
