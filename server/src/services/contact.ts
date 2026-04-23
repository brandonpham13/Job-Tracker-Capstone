import { Contact } from "../models/Contact.js";
import { ContactStore } from "../store/contact.js";

export class ContactService {
  constructor(private readonly contactStore: ContactStore) {}

  async list(_userId: string): Promise<Contact[]> {
    throw new Error("TODO");
  }

  async getById(_userId: string, _id: string): Promise<Contact | null> {
    throw new Error("TODO");
  }

  async create(_userId: string, _data: Omit<Contact, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Contact> {
    throw new Error("TODO");
  }

  async update(_userId: string, _id: string, _updates: Partial<Contact>): Promise<Contact> {
    throw new Error("TODO");
  }

  async delete(_userId: string, _id: string): Promise<void> {
    throw new Error("TODO");
  }

  async attachToJob(_userId: string, _jobId: string, _contactId: string): Promise<void> {
    throw new Error("TODO");
  }

  async detachFromJob(_userId: string, _jobId: string, _contactId: string): Promise<void> {
    throw new Error("TODO");
  }
}
