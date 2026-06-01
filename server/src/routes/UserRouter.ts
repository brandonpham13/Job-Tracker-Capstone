import { Router, type Request, type Response } from "express";
import { UserService } from "../services/user.js";

export class UserRouter {
  router: Router;

  constructor(private userService: UserService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // POST /api/users (signup/register)
    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ error: "Email is required" });
        }
        const user = await this.userService.signup(email);
        res.status(201).json(user);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create user";
        res.status(400).json({ error: message });
      }
    });

    // GET /api/users/:id
    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = getString(req.params.id);
        const user = await this.userService.getById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch user";
        res.status(500).json({ error: message });
      }
    });

    // PUT /api/users/me
    this.router.put("/me", async (req: Request, res: Response) => {
      try {
        const updated = await this.userService.updateProfile(req.userId!, req.body);
        res.json(updated);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update user";
        res.status(500).json({ error: message });
      }
    });

    // DELETE /api/users/me
    this.router.delete("/me", async (req: Request, res: Response) => {
      try {
        await this.userService.delete(req.userId!);
        res.json({ message: "User deleted" });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete user";
        res.status(500).json({ error: message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
