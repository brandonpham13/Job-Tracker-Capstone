import { Job } from "../models/Job.js";

/**
 * Class used to store and retrieve jobs from the database.
 */
export class JobStore {
  async findById(_id: string): Promise<Job | null> {
    throw new Error("Not implemented");
  }

  async findAllByUser(_userId: string): Promise<Job[]> {
    throw new Error("Not implemented");
  }

  async create(_job: Job): Promise<Job> {
    throw new Error("Not implemented");
  }

  async update(_job: Job): Promise<Job> {
    throw new Error("Not implemented");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
