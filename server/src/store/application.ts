import type { PrismaClient, Application, ApplicationStatus } from "@prisma/client";

export class ApplicationStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(appId: string): Promise<Application | null> {
        return this.prisma.application.findUnique({ where: { app_id: appId } });
    }

    async findAllByUser(userId: string): Promise<Application[]> {
        return this.prisma.application.findMany({ where: { user_id: userId } });
    }

    async findByUserAndStatus(userId: string, status: ApplicationStatus): Promise<Application[]> {
        return this.prisma.application.findMany({ where: { user_id: userId, status } });
    }

    async findByUserWithSort(userId: string, sortBy?: string): Promise<Application[]> {
        const orderBy = sortBy === "date" ? { application_date: "desc" as const } : { created_at: "desc" as const };
        return this.prisma.application.findMany({ where: { user_id: userId }, orderBy });
    }

    async create(data: Omit<Application, "app_id" | "created_at">): Promise<Application> {
        return this.prisma.application.create({ data });
    }

    async update(appId: string, data: Partial<Omit<Application, "app_id" | "user_id" | "created_at">>): Promise<Application> {
        return this.prisma.application.update({ where: { app_id: appId }, data });
    }

    async delete(appId: string): Promise<void> {
        await this.prisma.application.delete({ where: { app_id: appId } });
    }
}
