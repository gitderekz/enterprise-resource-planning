const jwt = require('jsonwebtoken');
const ROLE_IDS = require('../utils/roles'); // Adjust the import path as necessary

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded token and role information to the request object
        req.user = decoded;
        req.user.isSuperAdmin = decoded.role_id === ROLE_IDS.superadmin; // Assuming ROLE_IDS is an object mapping role names to IDs
        req.user.isAdmin = decoded.role_id === ROLE_IDS.admin; // Assuming ROLE_IDS is an object mapping role names to IDs
        req.user.isManager = decoded.role_id === ROLE_IDS.manager; // Assuming ROLE_IDS is an object mapping role names to IDs
        req.user.isHr = decoded.role_id === ROLE_IDS.hr; // Assuming ROLE_IDS is an object mapping role names to IDs
        req.user.finance = decoded.role_id === ROLE_IDS.finance; // Assuming ROLE_IDS is an object mapping role names to IDs
        req.user.isEmployee = decoded.role_id === ROLE_IDS.employee; // Assuming ROLE_IDS is an object mapping role names to IDs
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = auth;