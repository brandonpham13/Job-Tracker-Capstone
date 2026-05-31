import type { PrismaClient } from "@prisma/client";

export class ApplicationContactStore {
  constructor(private prisma: PrismaClient) {}

  async create(appId: string, contactId: string) {
    return this.prisma.applicationContact.create({
      data: {
        app_id: appId,
        contact_id: contactId,
      },
    });
  }

  async delete(appId: string, contactId: string) {
    return this.prisma.applicationContact.delete({
      where: {
        app_id_contact_id: {
          app_id: appId,
          contact_id: contactId,
        },
      },
    });
  }

  async findByApplication(appId: string) {
    return this.prisma.applicationContact.findMany({
      where: { app_id: appId },
      include: { contact: true },
    });
  }
}
