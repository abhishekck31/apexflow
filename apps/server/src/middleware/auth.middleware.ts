import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: "JWT secret is not defined" });
    }

    try {
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired Token" });
    }
};

export const authorizeAdmin = (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Access Denied: Administrative Clearance Required" });
    }
    next();
};
