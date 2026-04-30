import type { PrismaClient, Skill } from "@prisma/client";

export class SkillStore {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(skillId: string): Promise<Skill | null> {
        return this.prisma.skill.findUnique({ where: { skill_id: skillId } });
    }

    async findByName(skillName: string): Promise<Skill | null> {
        return this.prisma.skill.findUnique({ where: { skill_name: skillName } });
    }

    async findAll(): Promise<Skill[]> {
        return this.prisma.skill.findMany();
    }

    async findAllByApplication(appId: string): Promise<Skill[]> {
        const links = await this.prisma.applicationSkill.findMany({
            where: { app_id: appId },
            include: { skill: true },
        });
        return links.map((link) => link.skill);
    }

    async create(data: Omit<Skill, "skill_id">): Promise<Skill> {
        return this.prisma.skill.create({ data });
    }

    async update(skillId: string, data: Partial<Omit<Skill, "skill_id">>): Promise<Skill> {
        return this.prisma.skill.update({ where: { skill_id: skillId }, data });
    }

    async delete(skillId: string): Promise<void> {
        await this.prisma.skill.delete({ where: { skill_id: skillId } });
    }

    async linkToApplication(appId: string, skillId: string): Promise<void> {
        await this.prisma.applicationSkill.create({
            data: { app_id: appId, skill_id: skillId },
        });
    }

    async unlinkFromApplication(appId: string, skillId: string): Promise<void> {
        await this.prisma.applicationSkill.delete({
            where: { app_id_skill_id: { app_id: appId, skill_id: skillId } },
        });
    }
}
