import type { PrismaClient, User } from "@prisma/client";

/**
 * Class used to store and retrieve users from the database.
 */
export class UserStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async update(id: string, data: Partial<Pick<User, "email" | "displayName" | "passwordHash">>): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}

