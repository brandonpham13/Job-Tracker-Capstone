import type { Application, ApplicationStatus } from "@prisma/client";
import type { ApplicationStore } from "../store/application.js";

export class ApplicationService {
    constructor(private readonly applicationStore: ApplicationStore) { }

    async list(userId: string, status?: ApplicationStatus, sortBy?: string): Promise<Application[]> {
        if (status) {
            return this.applicationStore.findByUserAndStatus(userId, status);
        }
        return this.applicationStore.findByUserWithSort(userId, sortBy);
    }

    async getById(userId: string, appId: string): Promise<Application | null> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) return null;
        return app;
    }

    async create(userId: string, data: Omit<Application, "app_id" | "user_id" | "created_at">): Promise<Application> {
        if (!data.company_name || !data.role) {
            throw new Error("Company name and role are required");
        }
        return this.applicationStore.create({ ...data, user_id: userId });
    }

    async update(userId: string, appId: string, updates: Partial<Omit<Application, "app_id" | "user_id" | "created_at">>): Promise<Application> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        return this.applicationStore.update(appId, updates);
    }

    async updateStatus(userId: string, appId: string, status: ApplicationStatus): Promise<Application> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        return this.applicationStore.update(appId, { status });
    }

    async delete(userId: string, appId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        return this.applicationStore.delete(appId);
    }
}
