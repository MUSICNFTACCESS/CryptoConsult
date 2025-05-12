const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getTokenPrice(tokenName) {
  try {
    const idRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${tokenName}`);
    const coin = idRes.data.coins[0];
    if (!coin) return null;
    const priceRes = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd`);
    return { name: coin.name, price: priceRes.data[coin.id].usd };
  } catch (err) {
    return null;
  }
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Try to extract token price if user asks for it
  let priceInfo = '';
  const match = userMessage.match(/price of (\w+)/i);
  if (match) {
    const token = match[1];
    const result = await getTokenPrice(token);
    if (result) {
      priceInfo = `As of now, the price of ${result.name} is $${result.price}.\n\n`;
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are CrimznBot, a crypto expert who responds like ChatGPT with deep market knowledge, live prices, and guidance. Always format prices clearly.' },
        { role: 'user', content: userMessage }
      ],
    });

    const reply = priceInfo + completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.json({ reply: 'CrimznBot had trouble reaching the AI server. Please try again later.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
