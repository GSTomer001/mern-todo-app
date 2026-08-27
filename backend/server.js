const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // allow cross-origin requests (handy if the proxy is not used)
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Mount the todo routes under /api/todos
app.use('/api/todos', require('./routes/todoRoutes'));

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Todo API is running' });
});

const PORT = process.env.PORT || 5000;

// Start the HTTP server ONLY after MongoDB has connected successfully.
// (Starting it beforehand printed "Server running" and then immediately
// crashed when the database connection failed, which looked like the
// server was up when it was not.)
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error('❌ Could not start the server because the database connection failed.');
    process.exit(1);
  });