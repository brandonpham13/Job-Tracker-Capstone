import { Job } from "../models/Job.js";
import { JobStore } from "../store/job.js";

export class JobService {
  constructor(private readonly jobStore: JobStore) {}

  async list(_userId: string): Promise<Job[]> {
    throw new Error("TODO");
  }

  async getById(_userId: string, _id: string): Promise<Job | null> {
    throw new Error("TODO");
  }

  async create(_userId: string, _data: Omit<Job, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Job> {
    throw new Error("TODO");
  }

  async update(_userId: string, _id: string, _updates: Partial<Job>): Promise<Job> {
    throw new Error("TODO");
  }

  async delete(_userId: string, _id: string): Promise<void> {
    throw new Error("TODO");
  }
}
