import type { PrismaClient, User } from "@prisma/client";

export class UserStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { user_id: userId } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data: Omit<User, "user_id" | "created_at">): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async update(userId: string, data: Partial<Pick<User, "email">>): Promise<User> {
        return this.prisma.user.update({ where: { user_id: userId }, data });
    }

    async delete(userId: string): Promise<void> {
        await this.prisma.user.delete({ where: { user_id: userId } });
    }
}
