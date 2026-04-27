import type { PrismaClient, Contact } from "@prisma/client";

/**
 * Class used to store and retrieve contacts from the database.
 */
export class ContactStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Contact | null> {
        return this.prisma.contact.findUnique({ where: { id } });
    }

    async findAllByUser(userId: string): Promise<Contact[]> {
        return this.prisma.contact.findMany({ where: { userId } });
    }

    async findAllByJob(jobId: string): Promise<Contact[]> {
        return this.prisma.contact.findMany({
            where: { jobs: { some: { id: jobId } } },
        });
    }

    async create(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
        return this.prisma.contact.create({ data });
    }

    async update(id: string, data: Partial<Omit<Contact, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Contact> {
        return this.prisma.contact.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.contact.delete({ where: { id } });
    }

    async linkToJob(jobId: string, contactId: string): Promise<void> {
        await this.prisma.job.update({
            where: { id: jobId },
            data: { contacts: { connect: { id: contactId } } },
        });
    }

    async unlinkFromJob(jobId: string, contactId: string): Promise<void> {
        await this.prisma.job.update({
            where: { id: jobId },
            data: { contacts: { disconnect: { id: contactId } } },
        });
    }
}

