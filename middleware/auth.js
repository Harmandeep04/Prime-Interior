import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token)
        return res.status(401).json({ success: false, message: 'Login karein pehle' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId    = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token invalid ya expired' });
    }
};

export default authMiddleware;