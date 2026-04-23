import { User } from "../models/User.js";

/**
 * Class used to store and retrieve users from the database.
 */
export class UserStore {
  async findById(_id: string): Promise<User | null> {
    throw new Error("Not implemented");
  }

  async findByEmail(_email: string): Promise<User | null> {
    throw new Error("Not implemented");
  }

  async create(_user: User): Promise<User> {
    throw new Error("Not implemented");
  }

  async update(_user: User): Promise<User> {
    throw new Error("Not implemented");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
