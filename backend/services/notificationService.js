const { Sequelize, Op } = require('sequelize');
const Notification = require('../models').notification;
const WebSocket = require('ws');

class NotificationService {
  constructor(wss) {
    this.wss = wss;
  }

  async createNotification({
    userIds,
    type = 'info',
    title,
    message,
    link,
    metadata = {} // Default empty object
  }) {
    console.log("Raw metadata received:", metadata); // Debug
    
    // Ensure metadata is always an object
    const safeMetadata = (metadata && typeof metadata === 'object') ? metadata : {};
    
    try {
      const notification = await Notification.create({
        userIds: Array.isArray(userIds) ? userIds : [userIds],
        type,
        title,
        message,
        link,
        metadata: {
          ...safeMetadata, // Spread the validated metadata
          createdAt: new Date().toISOString(),
          systemVersion: '1.0' // Example additional field
        }
      });
  
      console.log("Final notification metadata:", notification.metadata);
      await this.broadcastNotification(notification);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  async broadcastNotification(notification) {
    try {
      if (!this.wss) {
        console.warn('WebSocket server not initialized - skipping broadcast');
        return;
      }

      notification.userIds.forEach(userId => {
        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && 
              client.user && 
              client.user.id === userId) {
            client.send(JSON.stringify({
              type: 'NOTIFICATION',
              payload: notification
            }));
          }
        });
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  }

  async getUserNotifications(userId, limit = 20) {
    try {
      return await Notification.findAll({
        where: Sequelize.where(
            Sequelize.fn('JSON_CONTAINS', Sequelize.col('userIds'), JSON.stringify(Number(userId))),
          1
        ),
        order: [['createdAt', 'DESC']],
        limit
      });
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw new Error('Failed to fetch user notifications');
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          userIds: {
            [Op.contains]: [userId]
          }
        }
      });

      if (notification) {
        notification.isRead = true;
        await notification.save();
      }

      return notification;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw new Error('Failed to mark notification as read');
    }
  }
}

// module.exports = NotificationService;
// At the bottom of notificationService.js
const notificationServiceInstance = new NotificationService();
module.exports = {
  NotificationService,
  notificationServiceInstance
};



// const { Sequelize, Op } = require('sequelize');
// const Notification = require('../models').notification;
// const WebSocket = require('ws');

// class NotificationService {
//   static wss = null; // We'll set this when initializing the service

//   static async createNotification({
//     userIds,
//     type = 'info',
//     title,
//     message,
//     link,
//     metadata = {}
//   }) {
//     try {
//       const notification = await Notification.create({
//         userIds: Array.isArray(userIds) ? userIds : [userIds],
//         type,
//         title,
//         message,
//         link,
//         metadata
//       });

//       // Broadcast to online users
//       await this.broadcastNotification(notification);

//       return notification;
//     } catch (error) {
//       console.error('Error creating notification:', error);
//       throw new Error('Failed to create notification');
//     }
//   }

// //   static async broadcastNotification(notification) {
// //     try {
// //       if (!this.wss) {
// //         console.warn('WebSocket server not initialized - skipping broadcast');
// //         return;
// //       }

// //       notification.userIds.forEach(userId => {
// //         const client = [...this.wss.clients].find(
// //           client => client.user?.id === userId && client.readyState === WebSocket.OPEN
// //         );
        
// //         if (client) {
// //           client.send(JSON.stringify({
// //             type: 'NOTIFICATION',
// //             payload: notification
// //           }));
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Error broadcasting notification:', error);
// //     }
// //   }

//     static async broadcastNotification(notification) {
//         try {
//         if (!this.wss) {
//             console.warn('WebSocket server not initialized - skipping broadcast');
//             return;
//         }

//         notification.userIds.forEach(userId => {
//             // Find all clients for this user
//             this.wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN && 
//                 client.user && 
//                 client.user.id === userId) {
//                 client.send(JSON.stringify({
//                 type: 'NOTIFICATION',
//                 payload: notification
//                 }));
//             }
//             });
//         });
//         } catch (error) {
//         console.error('Error broadcasting notification:', error);
//         }
//     }

//   static async getUserNotifications(userId, limit = 20) {
//     try {
//       return await Notification.findAll({
//         where: Sequelize.where(
//           Sequelize.fn('JSON_CONTAINS', Sequelize.col('userIds'), JSON.stringify(userId)),
//           1
//         ),
//         order: [['createdAt', 'DESC']],
//         limit
//       });
//     } catch (error) {
//       console.error(`Error fetching notifications for user ${userId}:`, error);
//       throw new Error('Failed to fetch user notifications');
//     }
//   }
  

//   static async markAsRead(notificationId, userId) {
//     try {
//       const notification = await Notification.findOne({
//         where: {
//           id: notificationId,
//           userIds: {
//             [Op.contains]: [userId]
//           }
//         }
//       });

//       if (notification) {
//         notification.isRead = true;
//         await notification.save();
//       }

//       return notification;
//     } catch (error) {
//       console.error(`Error marking notification ${notificationId} as read:`, error);
//       throw new Error('Failed to mark notification as read');
//     }
//   }
// }

// module.exports = NotificationService;
