// const dotenv = require('dotenv');
// // Load env variables
// dotenv.config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const languageRoutes = require('./routes/languageRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/menu', menuRoutes);

// WebSocket Server
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
};

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`HTTP Server running on port ${process.env.PORT || 5000}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
  
  if (!verifyToken(token)) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

// Database setup
const db = require('./models');

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synced.'))
  .catch(err => console.error('Database error:', err));
