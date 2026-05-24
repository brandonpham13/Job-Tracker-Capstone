import { Router, type Request, type Response } from "express";
import { UserService } from "../services/user.js";

export class UserRouter {
  router: Router;

  constructor(private userService: UserService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /api/users/me
    this.router.get("/me", async (req: Request, res: Response) => {
      try {
        const user = await this.userService.getById(req.userId!);
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
      }
    });

    // PUT /api/users/me
    this.router.put("/me", async (req: Request, res: Response) => {
      try {
        const updated = await this.userService.updateProfile(req.userId!, req.body);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
    });

    // DELETE /api/users/me
    this.router.delete("/me", async (req: Request, res: Response) => {
      try {
        await this.userService.delete(req.userId!);
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
