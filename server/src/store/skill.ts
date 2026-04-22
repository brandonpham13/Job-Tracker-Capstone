import { Skill } from "../models/Skill.js";

/**
 * Class used to store and retrieve skills from the database.
 */
export class SkillStore {
  async findById(_id: string): Promise<Skill | null> {
    throw new Error("Not implemented");
  }

  async findAllByUser(_userId: string): Promise<Skill[]> {
    throw new Error("Not implemented");
  }

  async findAllByJob(_jobId: string): Promise<Skill[]> {
    throw new Error("Not implemented");
  }

  async create(_skill: Skill): Promise<Skill> {
    throw new Error("Not implemented");
  }

  async update(_skill: Skill): Promise<Skill> {
    throw new Error("Not implemented");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async linkToJob(_jobId: string, _skillId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async unlinkFromJob(_jobId: string, _skillId: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
