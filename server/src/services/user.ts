import { User } from "../models/User.js";
import { UserStore } from "../store/user.js";

export class UserService {
  constructor(private readonly userStore: UserStore) {}

  async getById(_id: string): Promise<User | null> {
    throw new Error("TODO");
  }

  async updateProfile(_id: string, _updates: Partial<Pick<User, "displayName" | "email">>): Promise<User> {
    throw new Error("TODO");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("TODO");
  }
}
