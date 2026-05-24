import { type Request, type Response, type NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import type { UserService } from "../services/user.js";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

/**
 * Creates middleware that verifies the Clerk session, resolves the
 * corresponding local database user (auto-provisioning on first visit),
 * and attaches `req.userId` for downstream route handlers.
 */
export function requireAuth(userService: UserService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId: clerkId } = getAuth(req);

            if (!clerkId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const clerkUser = await clerkClient.users.getUser(clerkId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;

            if (!email) {
                res.status(401).json({ error: "No email associated with account" });
                return;
            }

            const user = await userService.getOrCreateByClerkId(clerkId, email);
            req.userId = user.user_id;

            next();
        } catch (error) {
            console.error("[requireAuth] error:", error);
            res.status(401).json({ error: "Authentication failed" });
        }
    };
}
