import type { PrismaClient, Skill } from "@prisma/client";

/**
 * Class used to store and retrieve skills from the database.
 */
export class SkillStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Skill | null> {
        return this.prisma.skill.findUnique({ where: { id } });
    }

    async findAllByUser(userId: string): Promise<Skill[]> {
        return this.prisma.skill.findMany({ where: { userId } });
    }

    async findAllByJob(jobId: string): Promise<Skill[]> {
        return this.prisma.skill.findMany({
            where: { jobs: { some: { id: jobId } } },
        });
    }

    async create(data: Omit<Skill, "id" | "createdAt" | "updatedAt">): Promise<Skill> {
        return this.prisma.skill.create({ data });
    }

    async update(id: string, data: Partial<Omit<Skill, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Skill> {
        return this.prisma.skill.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.skill.delete({ where: { id } });
    }

    async linkToJob(jobId: string, skillId: string): Promise<void> {
        await this.prisma.job.update({
            where: { id: jobId },
            data: { skills: { connect: { id: skillId } } },
        });
    }

    async unlinkFromJob(jobId: string, skillId: string): Promise<void> {
        await this.prisma.job.update({
            where: { id: jobId },
            data: { skills: { disconnect: { id: skillId } } },
        });
    }
}

