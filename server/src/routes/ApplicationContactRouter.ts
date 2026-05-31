import { Router, type Request, type Response } from "express";
import { getString } from "../utils/typeHelpers.js";

export class ApplicationContactRouter {
  router: Router;

  constructor(private service: any) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET contacts for application
    this.router.get("/:appId", async (req, res) => {
      try {
        const appId = getString(req.params.appId);
        const result = await this.service.list(appId);
        res.json(result);
      } catch {
        res.status(500).json({ error: "Failed to fetch contacts" });
      }
    });

    // POST attach contact
    this.router.post("/:appId/:contactId", async (req, res) => {
      try {
        const appId = getString(req.params.appId);
        const contactId = getString(req.params.contactId);

        await this.service.attach(appId, contactId);

        res.status(201).json({ message: "Contact attached" });
      } catch (err) {
        console.error("Attach contact failed:", err);
        res.status(500).json({ error: "Failed to attach contact" });
      }
    });

    // DELETE contact from application
    this.router.delete(
      "/:appId/:contactId",
      async (req: Request, res: Response) => {
        try {
          const appId = getString(req.params.appId);
          const contactId = getString(req.params.contactId);

          await this.service.detach(appId, contactId);

          res.json({ message: "Contact detached" });
        } catch (err) {
          console.error("Detach contact failed:", err);
          res.status(500).json({ error: "Failed to detach contact" });
        }
      },
    );
  }

  getRouter() {
    return this.router;
  }
}
