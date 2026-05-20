import type { Skill } from "@prisma/client";
import type { SkillStore } from "../store/skill.js";
import type { ApplicationStore } from "../store/application.js";

export class SkillService {
    constructor(
        private readonly skillStore: SkillStore,
        private readonly applicationStore: ApplicationStore,
    ) { }

    async list(): Promise<Skill[]> {
        return this.skillStore.findAll();
    }

    async getById(skillId: string): Promise<Skill | null> {
        return this.skillStore.findById(skillId);
    }

    async create(data: Omit<Skill, "skill_id">): Promise<Skill> {
        return this.skillStore.create(data);
    }

    async update(skillId: string, updates: Partial<Omit<Skill, "skill_id">>): Promise<Skill> {
        const skill = await this.skillStore.findById(skillId);
        if (!skill) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.update(skillId, updates);
    }

    async delete(skillId: string): Promise<void> {
        const skill = await this.skillStore.findById(skillId);
        if (!skill) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.delete(skillId);
    }

    async attachToApplication(userId: string, appId: string, skillId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        const skill = await this.skillStore.findById(skillId);
        if (!skill) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.linkToApplication(appId, skillId);
    }

    async detachFromApplication(userId: string, appId: string, skillId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        const skill = await this.skillStore.findById(skillId);
        if (!skill) {
            throw new Error(`Skill with id ${skillId} not found`);
        }

        return this.skillStore.unlinkFromApplication(appId, skillId);
    }
}
