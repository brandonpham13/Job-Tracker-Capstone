import express, { type Request, type Response } from "express";
import { Container } from "./container.js";

export const app = express();
const container = new Container();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
