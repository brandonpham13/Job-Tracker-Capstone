import express, { type Request, type Response } from "express";
import { clerkMiddleware } from "@clerk/express";
import { prisma } from "./db.js";
import path from "path";
import { Container } from "./container.js";
import { requireAuth } from "./middleware/auth.js";
import { UserRouter } from "./routes/UserRouter.js";
import { JobRouter } from "./routes/JobRouter.js";
import { ContactRouter } from "./routes/ContactRouter.js";
import { SkillRouter } from "./routes/SkillRouter.js";
import { ApplicationSkillRouter } from "./routes/ApplicationSkillRouter.js";
import { ApplicationContactRouter } from "./routes/ApplicationContactRouter.js";

export const app = express();
const container = new Container(prisma);

app.use(express.json());
app.use(clerkMiddleware());

// Serve static client files
const clientPath = path.join(process.cwd(), "../client");
app.use(express.static(clientPath));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/auth/config", (_req: Request, res: Response) => {
  res.json({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY });
});

// All /api routes below require authentication
const auth = requireAuth(container.userService);

const userRouter = new UserRouter(container.userService);
const applicationRouter = new JobRouter(container.applicationService);
const contactRouter = new ContactRouter(container.contactService);
const skillRouter = new SkillRouter(container.skillService);
const applicationSkillRouter = new ApplicationSkillRouter(
  container.applicationSkillService,
);

const applicationContactRouter = new ApplicationContactRouter(
  container.applicationContactService,
);

app.use("/api/application-skills", auth, applicationSkillRouter.getRouter());
app.use(
  "/api/application-contacts",
  auth,
  applicationContactRouter.getRouter(),
);

app.use("/api/users", auth, userRouter.getRouter());
app.use("/api/applications", auth, applicationRouter.getRouter());
app.use("/api/contacts", auth, contactRouter.getRouter());
app.use("/api/skills", auth, skillRouter.getRouter());
