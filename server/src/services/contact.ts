import type { Contact } from "@prisma/client";
import type { ContactStore } from "../store/contact.js";
import type { ApplicationStore } from "../store/application.js";

export class ContactService {
    constructor(
        private readonly contactStore: ContactStore,
        private readonly applicationStore: ApplicationStore,
    ) { }

    async list(userId: string): Promise<Contact[]> {
        return this.contactStore.findAllByUser(userId);
    }

    async getById(userId: string, contactId: string): Promise<Contact | null> {
        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.user_id !== userId) return null;
        return contact;
    }

    async create(userId: string, data: Omit<Contact, "contact_id" | "user_id">): Promise<Contact> {
        return this.contactStore.create({ ...data, user_id: userId });
    }

    async update(userId: string, contactId: string, updates: Partial<Omit<Contact, "contact_id" | "user_id">>): Promise<Contact> {
        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.user_id !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.update(contactId, updates);
    }

    async delete(userId: string, contactId: string): Promise<void> {
        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.user_id !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.delete(contactId);
    }

    async attachToApplication(userId: string, appId: string, contactId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.user_id !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.linkToApplication(appId, contactId);
    }

    async detachFromApplication(userId: string, appId: string, contactId: string): Promise<void> {
        const app = await this.applicationStore.findById(appId);
        if (!app || app.user_id !== userId) {
            throw new Error(`Application with id ${appId} not found`);
        }

        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.user_id !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.unlinkFromApplication(appId, contactId);
    }
}
