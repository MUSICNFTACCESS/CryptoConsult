const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('Error with OpenAI:', err.message);
    res.json({ reply: 'Error connecting to CrimznBot.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
