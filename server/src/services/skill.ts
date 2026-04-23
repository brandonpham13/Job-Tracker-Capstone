import { Skill } from "../models/Skill.js";
import { SkillStore } from "../store/skill.js";

export class SkillService {
  constructor(private readonly skillStore: SkillStore) {}

  async list(_userId: string): Promise<Skill[]> {
    throw new Error("TODO");
  }

  async getById(_userId: string, _id: string): Promise<Skill | null> {
    throw new Error("TODO");
  }

  async create(_userId: string, _data: Omit<Skill, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Skill> {
    throw new Error("TODO");
  }

  async update(_userId: string, _id: string, _updates: Partial<Skill>): Promise<Skill> {
    throw new Error("TODO");
  }

  async delete(_userId: string, _id: string): Promise<void> {
    throw new Error("TODO");
  }

  async attachToJob(_userId: string, _jobId: string, _skillId: string): Promise<void> {
    throw new Error("TODO");
  }

  async detachFromJob(_userId: string, _jobId: string, _skillId: string): Promise<void> {
    throw new Error("TODO");
  }
}
