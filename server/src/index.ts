import { prisma } from "./db.js";
import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
    await prisma.$connect();
    console.log("Database connection established");

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
