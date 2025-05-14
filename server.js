const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
let usageCount = 0;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.use(express.static(__dirname));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  usageCount++;
  const userMessage = req.body.message || '';
  const lower = userMessage.toLowerCase();
  let reply = '';

console.log("User said:", lower);
  const match = lower.match(/(?:price of|what(?:'s| is) the price of) (\w+)/);
  if (match && match[1]) {
    const token = match[1].toLowerCase();
    try {
      const cg = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`);
      const data = await cg.json();
      if (data[token] && data[token].usd) {
        reply = `The current price of ${token.toUpperCase()} is $${data[token].usd}`;
        return res.json({ reply });
      } else {
        reply = `I couldn't find the price for "${token.toUpperCase()}". Try another token.`;
        return res.json({ reply });
      }
    } catch (e) {
      return res.json({ reply: 'Error fetching live token price.' });
    }
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }]
    });
    reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    res.json({ reply: 'Error talking to CrimznBot.' });
  }
});

app.get('/api/usage', (req, res) => {
  res.json({ usageCount });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
