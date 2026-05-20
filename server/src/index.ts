import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config();

const { prisma } = await import("./db.js");
const { app } = await import("./app.js");

const PORT = Number(process.env.PORT) || 3000;

await prisma.$connect();
console.log("Database connection established");

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
