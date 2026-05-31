import { Router, Request, Response } from "express";
import type { ApplicationService } from "../services/application.js";
import { getString } from "../utils/typeHelpers.js";

export class JobRouter {
    router: Router;

    constructor(private applicationService: ApplicationService) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes() {
        // GET /api/applications?userId=...&status=...&sortBy=date
        this.router.get("/", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.query.userId);
                const status = req.query.status as any;
                const sortBy = getString(req.query.sortBy);
                
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                const applications = await this.applicationService.list(userId, status, sortBy || undefined);
                res.json(applications);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch applications";
                res.status(500).json({ error: message });
            }
        });

        // GET /api/applications/:id
        this.router.get("/:id", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.query.userId);
                const id = getString(req.params.id);
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                const application = await this.applicationService.getById(userId, id);
                if (!application) {
                    return res.status(404).json({ error: "Application not found" });
                }
                res.json(application);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch application";
                res.status(500).json({ error: message });
            }
        });

        // POST /api/applications
        this.router.post("/", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.body.userId);
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                const { userId: _, ...data } = req.body;
                const application = await this.applicationService.create(userId, data);
                res.status(201).json(application);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to create application";
                res.status(400).json({ error: message });
            }
        });

        // PUT /api/applications/:id
        this.router.put("/:id", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.body.userId);
                const id = getString(req.params.id);
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                const { userId: _, ...updates } = req.body;
                const updated = await this.applicationService.update(userId, id, updates);
                res.json(updated);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to update application";
                res.status(500).json({ error: message });
            }
        });

        // PATCH /api/applications/:id/status - Update only the status
        this.router.patch("/:id/status", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.body.userId);
                const id = getString(req.params.id);
                const { status } = req.body;
                
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                if (!status) {
                    return res.status(400).json({ error: "Status is required" });
                }
                
                const updated = await this.applicationService.updateStatus(userId, id, status);
                res.json(updated);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to update application status";
                res.status(500).json({ error: message });
            }
        });

        // DELETE /api/applications/:id
        this.router.delete("/:id", async (req: Request, res: Response) => {
            try {
                const userId = getString(req.query.userId);
                const id = getString(req.params.id);
                if (!userId) {
                    return res.status(400).json({ error: "User ID is required" });
                }
                await this.applicationService.delete(userId, id);
                res.json({ message: "Application deleted" });
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to delete application";
                res.status(500).json({ error: message });
            }
        });
    }

    getRouter() {
        return this.router;
    }
}
