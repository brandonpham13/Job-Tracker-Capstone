import type { Application } from "@prisma/client";
import type { ApplicationStore } from "../store/application.js";

export class ApplicationService {
    constructor(private readonly applicationStore: ApplicationStore) { }

    async list(userId: string): Promise<Application[]> {
        return this.applicationStore.findAllByUser(userId);
    }

    async getById(userId: string, appId: string): Promise<Application | null> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) return null;
        return app;
    }

    async create(userId: string, data: Omit<Application, "app_id" | "user_id" | "created_at">): Promise<Application> {
        return this.applicationStore.create({ ...data, user_id: userId });
    }

    async update(userId: string, appId: string, updates: Partial<Omit<Application, "app_id" | "user_id" | "created_at">>): Promise<Application> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        return this.applicationStore.update(appId, updates);
    }

    async delete(userId: string, appId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        return this.applicationStore.delete(appId);
    }
}
