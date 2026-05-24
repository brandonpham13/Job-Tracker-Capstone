import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DIRECT_URL or DATABASE_URL environment variable is required");
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
