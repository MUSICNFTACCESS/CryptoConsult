const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { Configuration, OpenAIApi } = require('openai');

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

app.get('/', (req, res) => {
  res.send('CrimznBot backend is running!');
});

const handleChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    if (!OPENAI_API_KEY) {
      return res.json({ response: `CrimznBot: You said "${message}" — but no API key is set.` });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ response: reply });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ response: "CrimznBot had an error reaching OpenAI." });
  }
};

app.post('/chat', handleChat);
app.post('/api/chat', handleChat);

console.log("OPENAI_API_KEY loaded:", OPENAI_API_KEY ? "✅ Present" : "❌ Missing");
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
