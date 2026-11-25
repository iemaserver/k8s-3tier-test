const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const bikeRoutes = require('./routes/bikes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  const db = mongoose.connection.readyState === 1 ? 'up' : 'down';
  res.status(db === 'up' ? 200 : 503).json({ status: 'ok for now', db });
});

app.use('/api/bikes', bikeRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB, exiting.', err.message);
    process.exit(1);
  });

async function shutdown() {
  await mongoose.connection.close();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
