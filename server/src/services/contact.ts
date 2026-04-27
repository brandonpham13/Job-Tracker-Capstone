import type { Contact } from "@prisma/client";
import type { ContactStore } from "../store/contact.js";
import type { JobStore } from "../store/job.js";

export class ContactService {
    constructor(
        private readonly contactStore: ContactStore,
        private readonly jobStore: JobStore,
    ) { }

    async list(userId: string): Promise<Contact[]> {
        return this.contactStore.findAllByUser(userId);
    }

    async getById(userId: string, id: string): Promise<Contact | null> {
        const contact = await this.contactStore.findById(id);
        if (!contact || contact.userId !== userId) return null;
        return contact;
    }

    async create(userId: string, data: Omit<Contact, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Contact> {
        return this.contactStore.create({ ...data, userId });
    }

    async update(userId: string, id: string, updates: Partial<Omit<Contact, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Contact> {
        const contact = await this.contactStore.findById(id);
        if (!contact || contact.userId !== userId) {
            throw new Error(`Contact with id ${id} not found`);
        }

        return this.contactStore.update(id, updates);
    }

    async delete(userId: string, id: string): Promise<void> {
        const contact = await this.contactStore.findById(id);
        if (!contact || contact.userId !== userId) {
            throw new Error(`Contact with id ${id} not found`);
        }

        return this.contactStore.delete(id);
    }

    async attachToJob(userId: string, jobId: string, contactId: string): Promise<void> {
        const job = await this.jobStore.findById(jobId);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${jobId} not found`);
        }

        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.userId !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.linkToJob(jobId, contactId);
    }

    async detachFromJob(userId: string, jobId: string, contactId: string): Promise<void> {
        const job = await this.jobStore.findById(jobId);
        if (!job || job.userId !== userId) {
            throw new Error(`Job with id ${jobId} not found`);
        }

        const contact = await this.contactStore.findById(contactId);
        if (!contact || contact.userId !== userId) {
            throw new Error(`Contact with id ${contactId} not found`);
        }

        return this.contactStore.unlinkFromJob(jobId, contactId);
    }
}
