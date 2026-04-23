export class Contact {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    role?: string | null;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.name = params.name;
    this.email = params.email ?? null;
    this.phone = params.phone ?? null;
    this.company = params.company ?? null;
    this.role = params.role ?? null;
    this.notes = params.notes ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
