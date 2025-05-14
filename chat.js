const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// Try dynamic token lookup
async function searchCoinGeckoToken(query) {
  try {
    const searchRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);
    const firstMatch = searchRes.data.coins?.[0];
    return firstMatch?.id || null;
  } catch {
    return null;
  }
}

async function getTokenPrice(id) {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    return res.data[id]?.usd || null;
  } catch {
    return null;
  }
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let priceInfo = '';

  // Basic known tokens
  const knownTokens = ['bitcoin', 'ethereum', 'solana', 'pepe', 'ondo-finance'];
  for (const id of knownTokens) {
    if (userMessage.includes(id) || userMessage.includes(id.split('-')[0])) {
      const price = await getTokenPrice(id);
      if (price) {
        priceInfo += `${id.replace(/-/g, ' ')}: $${price}\n`;
      }
    }
  }

  // Try dynamic search if no known token matched
  if (!priceInfo) {
    const words = userMessage.split(' ');
    for (const word of words) {
      const id = await searchCoinGeckoToken(word);
      if (id) {
        const price = await getTokenPrice(id);
        if (price) {
          priceInfo += `${id.replace(/-/g, ' ')}: $${price}\n`;
          break;
        }
      }
    }
  }

  let prompt = userMessage;
  if (priceInfo) {
    prompt = `The user asked: "${userMessage}".\nHere are current token prices:\n${priceInfo}\nPlease answer their question including any useful insights.`;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful and up-to-date crypto consultant named CrimznBot.' },
        { role: 'user', content: prompt }
      ]
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error reaching OpenAI.' });
  }
});

module.exports = router;
