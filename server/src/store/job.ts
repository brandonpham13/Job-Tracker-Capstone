import type { PrismaClient, Job } from "@prisma/client";

/**
 * Class used to store and retrieve jobs from the database.
 */
export class JobStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Job | null> {
        return this.prisma.job.findUnique({ where: { id } });
    }

    async findAllByUser(userId: string): Promise<Job[]> {
        return this.prisma.job.findMany({ where: { userId } });
    }

    async create(data: Omit<Job, "id" | "createdAt" | "updatedAt">): Promise<Job> {
        return this.prisma.job.create({ data });
    }

    async update(id: string, data: Partial<Omit<Job, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Job> {
        return this.prisma.job.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.job.delete({ where: { id } });
    }
}

