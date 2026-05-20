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
        // GET /api/applications
        this.router.get("/", async (req: Request, res: Response) => {
            try {
                const applications = await this.applicationService.list(req.userId!);
                res.json(applications);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch applications";
                res.status(500).json({ error: message });
            }
        });

        // GET /api/applications/:id
        this.router.get("/:id", async (req: Request, res: Response) => {
            try {
                const id = getString(req.params.id);
                const application = await this.applicationService.getById(req.userId!, id);
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
                const application = await this.applicationService.create(req.userId!, req.body);
                res.status(201).json(application);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to create application";
                res.status(400).json({ error: message });
            }
        });

        // PUT /api/applications/:id
        this.router.put("/:id", async (req: Request, res: Response) => {
            try {
                const id = getString(req.params.id);
                const updated = await this.applicationService.update(req.userId!, id, req.body);
                res.json(updated);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to update application";
                res.status(500).json({ error: message });
            }
        });

        // DELETE /api/applications/:id
        this.router.delete("/:id", async (req: Request, res: Response) => {
            try {
                const id = getString(req.params.id);
                await this.applicationService.delete(req.userId!, id);
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
