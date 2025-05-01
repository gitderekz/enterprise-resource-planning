require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const db = require('./models'); // Sequelize models

const app = express();

// === CORS Setup ===
// Adjust origin for your frontend URL
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// === Route Imports ===
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const languageRoutes = require('./routes/languageRoutes');
const menuRoutes = require('./routes/menuRoutes');

// === Mount Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/menu', menuRoutes);

// === Start HTTP Server ===
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

// === WebSocket Setup ===
const wss = new WebSocket.Server({ server });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('WebSocket token verification failed:', err.message);
    return null;
  }
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  const user = verifyToken(token);
  if (!user) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  console.log('WebSocket client connected:', user.email || user.id);

  ws.on('message', (message) => {
    console.log('WebSocket message received:', message);

    // Echo to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => console.log('WebSocket client disconnected'));
});

// === DB Setup ===
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return db.sequelize.sync({ alter: true }); // consider false in production
  })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database connection error:', err));
