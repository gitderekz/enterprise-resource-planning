require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const db = require('./models'); // Sequelize models
const { NotificationService, notificationServiceInstance } = require('./services/notificationService');

const app = express();
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// === CORS Setup ===
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// === Route Imports ===
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const departmentRoute = require('./routes/departmentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const languageRoutes = require('./routes/languageRoutes');
const menuRoutes = require('./routes/menuRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const financeRoutes = require('./routes/financeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const cisRoutes = require('./routes/cisRoutes');

// === Mount Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoute);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hr/recruitment', recruitmentRoutes);
app.use('/api/hr/payroll', payrollRoutes);
app.use('/api/hr/attendance', attendanceRoutes);
app.use('/api/hr/timetable', timetableRoutes);
app.use('/api/hr/performance', performanceRoutes);
app.use('/api/hr/onboarding', onboardingRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cis', cisRoutes);

// === Start HTTP Server ===
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

// === WebSocket Setup ===
const wss = new WebSocket.Server({ server });

// Initialize NotificationService with WebSocket server
// NotificationService.wss = wss;
// const notificationService = new NotificationService(wss);
notificationServiceInstance.wss = wss; // This is the key change


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('WebSocket token verification failed:', err.message);
    return null;
  }
};

// Track connected clients with user information
const activeClients = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `${process.env.SOCKET_PROTOCOL}://${req.headers.host}`);
  const token = url.searchParams.get('token');

  const user = verifyToken(token);
  if (!user) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  // Attach user to the WebSocket connection
  ws.user = user;
  
  // Store connection by user ID
  activeClients.set(user.id, ws);
  console.log(`Client connected: ${user.id}`);

  ws.on('message', async (message) => {
    try {
      const { type, payload } = JSON.parse(message);
      
      if (['NEW_TASK', 'DELETE_TASK', 'info', 'task', 'alert', 'urgent'].includes(type)) {
        const notificationData = {
          userIds: payload.userIds || [user.id], // Include sender by default
          type: payload.type || 'task',
          title: payload.title || 'New Notification',
          message: payload.message || 'You have a new notification',
          link: payload.link || `/tasks/${payload.id || ''}`,
          metadata: {
            ...(payload.metadata || {}), // Preserve any existing metadata
            senderId: user.id,
            entityType: payload.type || 'task',
            entityId: payload.id || null,
            isFromWebSocket: true // Mark as WS notification
          }
        };
  
        console.log('Creating WS notification:', notificationData);
        await notificationServiceInstance.createNotification(notificationData);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    if (ws.user) {
      activeClients.delete(ws.user.id);
      console.log(`Client disconnected: ${ws.user.id}`);
    }
  });
});

// === DB Setup ===
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    // return db.sequelize.sync({ alter: true }); // consider false in production
  })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database connection error:', err));

// Export for testing or other modules
module.exports = { server, wss, notificationService: notificationServiceInstance, activeClients };
// Close server gracefully on exit
