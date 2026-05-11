import { Router, Request, Response } from "express";
import { UserService } from "../services/user.js";
import { getString } from "../utils/typeHelpers.js";

export class UserRouter {
  router: Router;

  constructor(private userService: UserService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /api/users/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const user = await this.userService.getById(id);
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
      }
    });

    // PUT /api/users/:id
    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const updated = await this.userService.updateProfile(id, req.body);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
    });

    // DELETE /api/users/:id
    this.router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        await this.userService.delete(id);
        res.json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
