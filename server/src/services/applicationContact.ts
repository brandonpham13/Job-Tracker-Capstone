import { PrismaClient } from "@prisma/client";

export class ApplicationContactService {
  constructor(private prisma: PrismaClient) {}

  list(appId: string) {
    return this.prisma.applicationContact.findMany({
      where: {
        app_id: appId,
      },
      include: {
        contact: true,
      },
    });
  }
  attach(appId: string, contactId: string) {
    return this.prisma.applicationContact.create({
      data: {
        app_id: appId,
        contact_id: contactId,
      },
    });
  }

  detach(appId: string, contactId: string) {
    return this.prisma.applicationContact.delete({
      where: {
        app_id_contact_id: {
          app_id: appId,
          contact_id: contactId,
        },
      },
    });
  }
}
