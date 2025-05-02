const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ reply: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error communicating with OpenAI.');
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log('CrimznBot server running on port', PORT);
});
