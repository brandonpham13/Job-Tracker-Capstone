import type { Request, Response, NextFunction } from "express";

// Extend Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

// Simple auth middleware - in production, this would verify Clerk JWT tokens
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // For now, extract userId from query or header
    const userId = req.query.userId as string || req.headers["x-user-id"] as string;
    
    if (!userId) {
        return res.status(401).json({ error: "User ID is required. Use ?userId=<id> or X-User-Id header" });
    }
    
    req.userId = userId;
    next();
}
