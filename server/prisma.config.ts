import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config();

import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
    },
});
