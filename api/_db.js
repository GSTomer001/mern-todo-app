/**
 * Cached MongoDB connection for Vercel serverless functions.
 *
 * Vercel functions are ephemeral - a warm instance may serve many requests,
 * so we skip the connect call entirely when the (singleton) Mongoose default
 * connection is already established.
 *
 * Uses the same mongoose instance as the backend models/controllers via
 * connectDB.getMongoose(), so readiness checks are always accurate even if
 * node_modules is duplicated (local dev vs. Vercel install layout).
 *
 * Requires MONGO_URI to be set in the Vercel environment (e.g. to a MongoDB
 * Atlas connection string).
 */
const connectDB = require('../backend/config/db');

module.exports = async function connect() {
  if (connectDB.isConnected()) return;
  await connectDB();
};