import express, { type Request, type Response } from "express";
import { prisma } from "./db.js";
import { Container } from "./container.js";

export const app = express();
const container = new Container(prisma);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});
