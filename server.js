const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CrimznBot backend is running!');
});

// Universal chat handler
const handleChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const reply = `You said: "${message}"`; // Replace with OpenAI call if needed
  res.json({ response: reply });
};

app.post('/chat', handleChat);
app.post('/api/chat', handleChat);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
