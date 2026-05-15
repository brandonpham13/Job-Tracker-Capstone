import { Job, JobStatus } from "../models/Job.js";
import { PrismaClient, Application, $Enums } from "@prisma/client";

/**
 * Class used to store and retrieve jobs from the database.
 * Maps between Prisma Application model and Job domain model.
 */
export class JobStore {
  constructor(private prisma: PrismaClient) {}

  /**
   * Maps a Prisma Application record to a Job domain model
   */
  private mapApplicationToJob(app: Application & { skills?: any; contacts?: any }): Job {
    return new Job({
      id: app.app_id,
      userId: app.user_id,
      company: app.company_name,
      title: app.role,
      type: "internship", // Default type since Prisma schema doesn't have it
      status: this.mapApplicationStatus(app.status) as JobStatus,
      description: app.job_description_text,
      appliedAt: app.application_date,
      createdAt: app.created_at,
      updatedAt: app.created_at, // Prisma schema doesn't have updatedAt
    });
  }

  /**
   * Maps Job status to Prisma ApplicationStatus enum
   */
  private mapJobStatusToApplicationStatus(status: string): $Enums.ApplicationStatus {
    const statusMap: Record<string, $Enums.ApplicationStatus> = {
      saved: "APPLIED",
      applied: "APPLIED",
      interviewing: "INTERVIEWING",
      offer: "OFFER",
      rejected: "REJECTED",
      accepted: "ACCEPTED",
      withdrawn: "WITHDRAWN",
    };
    return statusMap[status] || "APPLIED";
  }

  /**
   * Maps Prisma ApplicationStatus to Job status
   */
  private mapApplicationStatus(status: $Enums.ApplicationStatus): string {
    const statusMap: Record<$Enums.ApplicationStatus, string> = {
      APPLIED: "applied",
      INTERVIEWING: "interviewing",
      OFFER: "offer",
      REJECTED: "rejected",
      ACCEPTED: "accepted",
      WITHDRAWN: "withdrawn",
    };
    return statusMap[status] || "saved";
  }

  async findById(id: string): Promise<Job | null> {
    const application = await this.prisma.application.findUnique({
      where: { app_id: id },
      include: { skills: true, contacts: true },
    });

    if (!application) return null;
    return this.mapApplicationToJob(application);
  }

  async findAllByUser(userId: string): Promise<Job[]> {
    const applications = await this.prisma.application.findMany({
      where: { user_id: userId },
      include: { skills: true, contacts: true },
      orderBy: { created_at: "desc" },
    });

    return applications.map((app: Application & { skills?: any; contacts?: any }) => this.mapApplicationToJob(app));
  }

  async findByUserWithFilters(
    userId: string,
    filters?: {
      status?: string;
      searchTerm?: string;
      sortBy?: "date" | "company";
      sortOrder?: "asc" | "desc";
    }
  ): Promise<Job[]> {
    const where: any = { user_id: userId };

    // Apply status filter if provided
    if (filters?.status && filters.status !== "all") {
      where.status = this.mapJobStatusToApplicationStatus(filters.status);
    }

    // Apply search filter if provided (search in company name and role)
    if (filters?.searchTerm) {
      where.OR = [
        {
          company_name: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
        {
          role: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    // Determine sort field
    const sortField =
      filters?.sortBy === "company" ? "company_name" : "created_at";
    const sortOrder = filters?.sortOrder || "desc";

    const applications = await this.prisma.application.findMany({
      where,
      include: { skills: true, contacts: true },
      orderBy: { [sortField]: sortOrder },
    });

    return applications.map((app: Application & { skills?: any; contacts?: any }) => this.mapApplicationToJob(app));
  }

  async create(job: Job): Promise<Job> {
    const application = await this.prisma.application.create({
      data: {
        user_id: job.userId,
        company_name: job.company,
        role: job.title,
        status: this.mapJobStatusToApplicationStatus(job.status),
        application_date: job.appliedAt,
        job_description_text: job.description,
      },
      include: { skills: true, contacts: true },
    });

    return this.mapApplicationToJob(application);
  }

  async update(job: Job): Promise<Job> {
    const application = await this.prisma.application.update({
      where: { app_id: job.id },
      data: {
        company_name: job.company,
        role: job.title,
        status: this.mapJobStatusToApplicationStatus(job.status),
        application_date: job.appliedAt,
        job_description_text: job.description,
      },
      include: { skills: true, contacts: true },
    });

    return this.mapApplicationToJob(application);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({
      where: { app_id: id },
    });
  }
}
