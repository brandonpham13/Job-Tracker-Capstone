import type { Job } from "@prisma/client";
import type { JobStore } from "../store/job.js";

export class JobService {
    constructor(private readonly jobStore: JobStore) { }

    async list(userId: string): Promise<Job[]> {
        return this.jobStore.findAllByUser(userId);
    }

    async getById(userId: string, id: string): Promise<Job | null> {
        const job = await this.jobStore.findById(id);
        if (!job || job.userId !== userId) return null;
        return job;
    }

    async create(userId: string, data: Omit<Job, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Job> {
        return this.jobStore.create({ ...data, userId });
    }

    async update(userId: string, id: string, updates: Partial<Omit<Job, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Job> {
        const job = await this.jobStore.findById(id);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${id} not found`);
        }

        return this.jobStore.update(id, updates);
    }

    async delete(userId: string, id: string): Promise<void> {
        const job = await this.jobStore.findById(id);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${id} not found`);
        }

        return this.jobStore.delete(id);
    }
}
