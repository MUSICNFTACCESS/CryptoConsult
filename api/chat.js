const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const knownCoins = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  ondo: 'ondocoin',
  pepe: 'pepe',
  link: 'chainlink',
  dot: 'polkadot',
  ada: 'cardano',
  doge: 'dogecoin',
  avax: 'avalanche-2',
  matic: 'polygon',
};

async function getCoinPrices(userMessage) {
  const mentioned = Object.keys(knownCoins).filter(key =>
    userMessage.toLowerCase().includes(key)
  );
  const ids = [...new Set(mentioned.map(key => knownCoins[key]))];

  if (ids.length === 0) return null;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&t=${Date.now()}`;
    const res = await fetch(url);
    const data = await res.json();

    return ids
      .map(id => {
        const price = data[id]?.usd;
        return price ? `- ${id.charAt(0).toUpperCase() + id.slice(1)}: $${price}` : null;
      })
      .filter(Boolean)
      .join('\n');
  } catch (e) {
    return null;
  }
}

function generateChartLinks(userMessage) {
  const chartLinks = [];
  const tokens = Object.keys(knownCoins);
  tokens.forEach(token => {
    if (userMessage.toLowerCase().includes(token)) {
      chartLinks.push(`https://www.tradingview.com/symbols/${token.toUpperCase()}USDT/`);
    }
  });
  return chartLinks;
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const priceSummary = await getCoinPrices(userMessage);
  const chartLinks = generateChartLinks(userMessage);

  const messages = [
    {
      role: 'system',
      content: "You are CrimznBot, a GPT-4o powered crypto consultant built by Crimzn. Speak naturally and clearly. If the user asks for price data or chart info, use the injected context below."
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  if (priceSummary) {
    messages.unshift({
      role: 'system',
      content: `Live prices:\n${priceSummary}`
    });
  }

  if (chartLinks.length > 0 && userMessage.toLowerCase().includes("chart")) {
    messages.unshift({
      role: 'system',
      content: `Suggested chart links:\n${chartLinks.join('\n')}`
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ reply: 'Error reaching server. Please try again shortly.' });
  }
});

module.exports = router;
