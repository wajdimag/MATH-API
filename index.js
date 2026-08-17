const express = require('express');
const verifyToken = require('./auth');

const app = express();
app.use(express.json());

// Public health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Protected Zero Trust endpoints
app.post('/add', verifyToken, (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a + b });
});

app.post('/subtract', verifyToken, (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a - b });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Math API running on port ${PORT}`));

module.exports = app;
