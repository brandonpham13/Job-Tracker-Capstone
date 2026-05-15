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
    // GET /api/jobs?userId=...&status=...&search=...&sortBy=...&sortOrder=...
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const status = req.query.status ? String(req.query.status) : undefined;
        const searchTerm = req.query.search ? String(req.query.search) : undefined;
        const sortBy = req.query.sortBy ? String(req.query.sortBy) as "date" | "company" : undefined;
        const sortOrder = req.query.sortOrder ? String(req.query.sortOrder) as "asc" | "desc" : undefined;

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const jobs = await this.jobService.list(userId, {
          status,
          searchTerm,
          sortBy,
          sortOrder,
        });
        res.json(jobs);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch jobs";
        res.status(500).json({ error: message });
      }
    });

    // GET /api/jobs/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const job = await this.jobService.getById(userId, id);
        if (!job) {
          return res.status(404).json({ error: "Job not found" });
        }
        res.json(job);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch job";
        res.status(500).json({ error: message });
      }
    });

    // POST /api/jobs
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const job = await this.jobService.create(userId, req.body);
        res.status(201).json(job);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create job";
        res.status(400).json({ error: message });
      }
    });

    // PUT /api/jobs/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const id = getString(req.params.id);

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const updated = await this.jobService.update(userId, id, req.body);
        res.json(updated);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update job";
        const statusCode = message.includes("Unauthorized") ? 403 : 500;
        res.status(statusCode).json({ error: message });
      }
    });

    // DELETE /api/jobs/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        await this.jobService.delete(userId, id);
        res.json({ message: "Job deleted" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete job";
        const statusCode = message.includes("Unauthorized") ? 403 : 500;
        res.status(statusCode).json({ error: message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
