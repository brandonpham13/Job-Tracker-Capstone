import { PrismaClient } from "@prisma/client";

export class ApplicationSkillService {
  constructor(private prisma: PrismaClient) {}

  list(appId: string) {
    return this.prisma.applicationSkill.findMany({
      where: {
        app_id: appId,
      },
      include: {
        skill: true,
      },
    });
  }

  attach(appId: string, skillId: string) {
    return this.prisma.applicationSkill.create({
      data: {
        app_id: appId,
        skill_id: skillId,
      },
    });
  }

  detach(appId: string, skillId: string) {
    return this.prisma.applicationSkill.delete({
      where: {
        app_id_skill_id: {
          app_id: appId,
          skill_id: skillId,
        },
      },
    });
  }
}
