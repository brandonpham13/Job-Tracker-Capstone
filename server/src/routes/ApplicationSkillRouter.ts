import { Router, type Request, type Response } from "express";
import { getString } from "../utils/typeHelpers.js";

export class ApplicationSkillRouter {
  router: Router;

  constructor(private service: any) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET skills for application
    this.router.get("/:appId", async (req: Request, res: Response) => {
      try {
        const appId = getString(req.params.appId);
        const result = await this.service.list(appId);
        res.json(result);
      } catch {
        res.status(500).json({ error: "Failed to fetch skills" });
      }
    });

    // POST attach skill
    this.router.post("/:appId/:skillId", async (req, res) => {
      try {
        const appId = getString(req.params.appId);
        const skillId = getString(req.params.skillId);

        await this.service.attach(appId, skillId);

        res.status(201).json({ message: "Skill attached" });
      } catch (err) {
        console.error("Attach skill failed:", err);
        res.status(500).json({ error: "Failed to attach skill" });
      }
    });

    // DELETE skill from application
    this.router.delete(
      "/:appId/:skillId",
      async (req: Request, res: Response) => {
        try {
          const appId = getString(req.params.appId);
          const skillId = getString(req.params.skillId);

          await this.service.detach(appId, skillId);

          res.json({ message: "Skill detached" });
        } catch (err) {
          console.error("Detach skill failed:", err);
          res.status(500).json({ error: "Failed to detach skill" });
        }
      },
    );
  }

  getRouter() {
    return this.router;
  }
}
