const NotificationService = require('./notificationService');

function initializeServices(wss) {
  NotificationService.wss = wss;
}

module.exports = {
  NotificationService,
  initializeServices
};