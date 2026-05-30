import type { PrismaClient } from "@prisma/client";

export class ApplicationSkillStore {
  constructor(private prisma: PrismaClient) {}

  async create(appId: string, skillId: string) {
    return this.prisma.applicationSkill.create({
      data: {
        app_id: appId,
        skill_id: skillId,
      },
    });
  }

  async delete(appId: string, skillId: string) {
    return this.prisma.applicationSkill.delete({
      where: {
        app_id_skill_id: {
          app_id: appId,
          skill_id: skillId,
        },
      },
    });
  }

  async findByApplication(appId: string) {
    return this.prisma.applicationSkill.findMany({
      where: { app_id: appId },
      include: { skill: true },
    });
  }
}
