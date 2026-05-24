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
    // GET /api/contacts
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const contacts = await this.contactService.list(req.userId!);
        res.json(contacts);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch contacts" });
      }
    });

    // GET /api/contacts/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const contact = await this.contactService.getById(req.userId!, id);
        res.json(contact);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch contact" });
      }
    });

    // POST /api/contacts
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const { name, linkedin_url, last_contact_date, notes } = req.body;
        const contact = await this.contactService.create(req.userId!, {
          name,
          linkedin_url: linkedin_url ?? null,
          last_contact_date: last_contact_date ? new Date(last_contact_date) : null,
          notes: notes ?? null,
        });
        res.status(201).json(contact);
      } catch (error) {
        res.status(500).json({ error: "Failed to create contact" });
      }
    });

    // PUT /api/contacts/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const { name, linkedin_url, last_contact_date, notes } = req.body;
        const updated = await this.contactService.update(req.userId!, id, {
          name,
          linkedin_url: linkedin_url ?? null,
          last_contact_date: last_contact_date ? new Date(last_contact_date) : null,
          notes: notes ?? null,
        });
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update contact" });
      }
    });

    // DELETE /api/contacts/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        await this.contactService.delete(req.userId!, id);
        res.json({ message: "Contact deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete contact" });
      }
    });

    // POST /api/contacts/:contactId/jobs/:jobId
    this.router.post("/:contactId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const contactId = getString(req.params.contactId);
        await this.contactService.attachToApplication(req.userId!, jobId, contactId);
        res.json({ message: "Contact attached to job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to attach contact to application" });
      }
    });

    // DELETE /api/contacts/:contactId/jobs/:jobId
    this.router.delete("/:contactId/jobs/:jobId", async (req: Request, res: Response) => {
      try {
        const jobId = getString(req.params.jobId);
        const contactId = getString(req.params.contactId);
        await this.contactService.detachFromApplication(req.userId!, jobId, contactId);
        res.json({ message: "Contact detached from job" });
      } catch (error) {
        res.status(500).json({ error: "Failed to detach contact from application" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
