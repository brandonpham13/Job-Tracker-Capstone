import { Router, Request, Response } from "express";
import { ContactService } from "../services/contact.js";
import { getString } from "../utils/typeHelpers.js";

export class ContactRouter {
  router: Router;

  constructor(private contactService: ContactService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /api/contacts?userId=...
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const contacts = await this.contactService.list(userId);
        res.json(contacts);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch contacts" });
      }
    });

    // GET /api/contacts/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);
        const contact = await this.contactService.getById(userId, id);
        res.json(contact);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch contact" });
      }
    });

    // POST /api/contacts
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const contact = await this.contactService.create(userId, req.body);
        res.status(201).json(contact);
      } catch (error) {
        res.status(500).json({ error: "Failed to create contact" });
      }
    });

    // PUT /api/contacts/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const id = getString(req.params.id);
        const updated = await this.contactService.update(userId, id, req.body);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update contact" });
      }
    });

    // DELETE /api/contacts/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const id = getString(req.params.id);
        await this.contactService.delete(userId, id);
        res.json({ message: "Contact deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete contact" });
      }
    });

    // POST /api/contacts/:contactId/jobs/:jobId (attach contact to job)
    this.router.post("/:contactId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.body.userId);
        const jobId = getString(req.params.jobId);
        const contactId = getString(req.params.contactId);
        await this.contactService.attachToJob(userId, jobId, contactId);
        res.json({ message: "Contact attached to job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to attach contact to job" });
      }
    });

    // DELETE /api/contacts/:contactId/jobs/:jobId (detach contact from job)
    this.router.delete("/:contactId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const userId = getString(req.query.userId);
        const jobId = getString(req.params.jobId);
        const contactId = getString(req.params.contactId);
        await this.contactService.detachFromJob(userId, jobId, contactId);
        res.json({ message: "Contact detached from job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to detach contact from job" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
