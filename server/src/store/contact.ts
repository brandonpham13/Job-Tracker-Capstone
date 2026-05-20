import type { PrismaClient, Contact } from "@prisma/client";

export class ContactStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(contactId: string): Promise<Contact | null> {
        return this.prisma.contact.findUnique({ where: { contact_id: contactId } });
    }

    async findAllByUser(userId: string): Promise<Contact[]> {
        return this.prisma.contact.findMany({ where: { user_id: userId } });
    }

    async findAllByApplication(appId: string): Promise<Contact[]> {
        const links = await this.prisma.applicationContact.findMany({
            where: { app_id: appId },
            include: { contact: true },
        });
        return links.map((link) => link.contact);
    }

    async create(data: Omit<Contact, "contact_id">): Promise<Contact> {
        return this.prisma.contact.create({ data });
    }

    async update(contactId: string, data: Partial<Omit<Contact, "contact_id" | "user_id">>): Promise<Contact> {
        return this.prisma.contact.update({ where: { contact_id: contactId }, data });
    }

    async delete(contactId: string): Promise<void> {
        await this.prisma.contact.delete({ where: { contact_id: contactId } });
    }

    async linkToApplication(appId: string, contactId: string): Promise<void> {
        await this.prisma.applicationContact.create({
            data: { app_id: appId, contact_id: contactId },
        });
    }

    async unlinkFromApplication(appId: string, contactId: string): Promise<void> {
        await this.prisma.applicationContact.delete({
            where: { app_id_contact_id: { app_id: appId, contact_id: contactId } },
        });
    }
}
