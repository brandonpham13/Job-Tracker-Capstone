import { Contact } from "../models/Contact.js";

/**
 * Class used to store and retrieve contacts from the database. 
 */
export class ContactStore {
  async findById(_id: string): Promise<Contact | null> {
    throw new Error("Not implemented");
  }

  async findAllByUser(_userId: string): Promise<Contact[]> {
    throw new Error("Not implemented");
  }

  async findAllByJob(_jobId: string): Promise<Contact[]> {
    throw new Error("Not implemented");
  }

  async create(_contact: Contact): Promise<Contact> {
    throw new Error("Not implemented");
  }

  async update(_contact: Contact): Promise<Contact> {
    throw new Error("Not implemented");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async linkToJob(_jobId: string, _contactId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async unlinkFromJob(_jobId: string, _contactId: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
