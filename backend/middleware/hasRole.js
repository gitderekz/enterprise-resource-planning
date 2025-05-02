// middleware/hasRole.js

const ROLE_IDS = require('../utils/roles');

const hasRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const requiredRoleId = ROLE_IDS[requiredRole];
    if (!requiredRoleId) {
      return res.status(500).json({ message: `Role "${requiredRole}" not defined` });
    }

    if (req.user.role_id !== requiredRoleId) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};

module.exports = hasRole;
