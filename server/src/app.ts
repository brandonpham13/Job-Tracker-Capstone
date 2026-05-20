import express, { type Request, type Response } from "express";
import { prisma } from "./db.js";
import path from "path";
import { Container } from "./container.js";
import { UserRouter } from "./routes/UserRouter.js";
import { JobRouter } from "./routes/JobRouter.js";
import { ContactRouter } from "./routes/ContactRouter.js";
import { SkillRouter } from "./routes/SkillRouter.js";

export const app = express();
const container = new Container(prisma);

app.use(express.json());

// Serve static client files
const clientPath = path.join(process.cwd(), "../client");
app.use(express.static(clientPath));

// Serve index.html for root and other SPA routes
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, "pages", "index.html"));
});

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

// Register API routes
const userRouter = new UserRouter(container.userService);
const applicationRouter = new JobRouter(container.applicationService);
const contactRouter = new ContactRouter(container.contactService);
const skillRouter = new SkillRouter(container.skillService);

app.use("/api/users", userRouter.getRouter());
app.use("/api/applications", applicationRouter.getRouter());
app.use("/api/contacts", contactRouter.getRouter());
app.use("/api/skills", skillRouter.getRouter());
