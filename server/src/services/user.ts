import type { User } from "@prisma/client";
import type { UserStore } from "../store/user.js";

export class UserService {
    constructor(private readonly userStore: UserStore) { }

    async signup(email: string): Promise<User> {
        const existingUser = await this.userStore.findByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        return this.userStore.create({ email });
    }

    async getById(id: string): Promise<User | null> {
        return this.userStore.findById(id);
    }

    async updateProfile(id: string, updates: Partial<Pick<User, "email">>): Promise<User> {
        const user = await this.userStore.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return this.userStore.update(id, updates);
    }

    async delete(id: string): Promise<void> {
        return this.userStore.delete(id);
    }
}
