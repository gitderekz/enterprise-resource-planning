const express = require('express');
const router = express.Router();
const { notificationServiceInstance } = require('../services/notificationService');
const auth = require('../middleware/auth');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await notificationServiceInstance.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await notificationServiceInstance.markAsRead(
      req.params.id, 
      req.user.id
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notification (admin only)
router.post('/', auth, async (req, res) => {
    if (!req.user.isHr) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    try {
      console.log('Incoming request metadata:', req.body.metadata); // Debug log
      
      const notification = await notificationServiceInstance.createNotification({
        userIds: req.body.userIds,
        type: req.body.type,
        title: req.body.title,
        message: req.body.message,
        link: req.body.link,
        metadata: {
          ...(req.body.metadata || {}), // Preserve incoming metadata
          systemAdded: 'some-value' // Example of additional metadata
        }
      });
      
      res.status(201).json(notification);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

module.exports = router;