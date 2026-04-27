import type { Skill } from "@prisma/client";
import type { SkillStore } from "../store/skill.js";
import type { JobStore } from "../store/job.js";

export class SkillService {
    constructor(
        private readonly skillStore: SkillStore,
        private readonly jobStore: JobStore,
    ) { }

    async list(userId: string): Promise<Skill[]> {
        return this.skillStore.findAllByUser(userId);
    }

    async getById(userId: string, id: string): Promise<Skill | null> {
        const skill = await this.skillStore.findById(id);
        if (!skill || skill.userId !== userId) return null;
        return skill;
    }

    async create(userId: string, data: Omit<Skill, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Skill> {
        return this.skillStore.create({ ...data, userId });
    }

    async update(userId: string, id: string, updates: Partial<Omit<Skill, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Skill> {
        const skill = await this.skillStore.findById(id);
        if (!skill || skill.userId !== userId) {
            throw new Error(`Skill with id ${id} not found`);
        }

        return this.skillStore.update(id, updates);
    }

    async delete(userId: string, id: string): Promise<void> {
        const skill = await this.skillStore.findById(id);
        if (!skill || skill.userId !== userId) {
            throw new Error(`Skill with id ${id} not found`);
        }

        return this.skillStore.delete(id);
    }

    async attachToJob(userId: string, jobId: string, skillId: string): Promise<void> {
        const job = await this.jobStore.findById(jobId);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${jobId} not found`);
        }

        const skill = await this.skillStore.findById(skillId);
        if (!skill || skill.userId !== userId) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.linkToJob(jobId, skillId);
    }

    async detachFromJob(userId: string, jobId: string, skillId: string): Promise<void> {
        const job = await this.jobStore.findById(jobId);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${jobId} not found`);
        }

        const skill = await this.skillStore.findById(skillId);
        if (!skill || skill.userId !== userId) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.unlinkFromJob(jobId, skillId);
    }
}
