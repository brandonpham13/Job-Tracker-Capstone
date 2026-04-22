export type JobStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "accepted"
  | "withdrawn";

export type JobType = "full_time" | "part_time" | "internship" | "contract";

export class Job {
  id: string;
  userId: string;
  company: string;
  title: string;
  type: JobType;
  status: JobStatus;
  location: string | null;
  url: string | null;
  description: string | null;
  notes: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    company: string;
    title: string;
    type: JobType;
    status: JobStatus;
    location?: string | null;
    url?: string | null;
    description?: string | null;
    notes?: string | null;
    appliedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.company = params.company;
    this.title = params.title;
    this.type = params.type;
    this.status = params.status;
    this.location = params.location ?? null;
    this.url = params.url ?? null;
    this.description = params.description ?? null;
    this.notes = params.notes ?? null;
    this.appliedAt = params.appliedAt ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
