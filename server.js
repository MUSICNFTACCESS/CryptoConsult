const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// CrimznBot logic
const chatHandler = require('./api/chat');

app.use(express.json());
app.post('/api/chat', chatHandler); // <-- Connects CrimznBot

// Serve frontend
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
