const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CrimznBot backend is running!');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  res.json({ reply: `You said: "${message}"` }); // (your OpenAI call would be here)
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
