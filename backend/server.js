const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const languageRoutes = require('./routes/languageRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/menu', menuRoutes);

// Import models and Sequelize instance
const db = require('./models'); // This loads all models from backend/models/index.js

// Start server after DB sync
const PORT = process.env.PORT || 5000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');

    return db.sequelize.sync({ alter: true }); // or { force: true } for dev only
  })
  .then(() => {
    console.log('Database synced.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect or sync database:', err);
  });
