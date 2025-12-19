export const isAdmin = (req, res, next) => {
    // req.user is populated by your existing authenticateToken middleware
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Admin access only" });
    }
};