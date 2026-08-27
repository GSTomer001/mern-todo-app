const mongoose = require('mongoose');

/**
 * connectDB
 * Establishes a connection to MongoDB using the connection string
 * stored in the MONGO_URI environment variable.
 *
 * Throws an error on failure (the caller decides how to handle it), and
 * prints troubleshooting hints so a missing database is obvious.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1) Is MongoDB running? Start it (e.g. run "mongod", or start the MongoDB Windows service).');
    console.error('  2) Using a cloud database? Put its connection string in backend/.env under MONGO_URI.');
    console.error('     Check the "backend/.env" file - it currently points to: ' + process.env.MONGO_URI);
    throw error;
  }
};

// Serverless deployments (e.g. Vercel) share this module with the model/controllers,
// so exposing the mongoose instance guarantees everyone checks/uses the SAME connection.
connectDB.getMongoose = () => mongoose;
connectDB.isConnected = () => mongoose.connection.readyState === 1;
connectDB.disconnect = () => mongoose.disconnect();

module.exports = connectDB;