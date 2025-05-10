const express = require('express');
const path = require('path');
const app = express();
const chatRoute = require('./api/chat'); // <== This loads CrimznBot
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Required to parse JSON body
app.use(chatRoute);      // Use /api/chat route

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
