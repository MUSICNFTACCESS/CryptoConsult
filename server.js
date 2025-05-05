const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

// Load full coin list from CoinGecko
let coinList = [];

async function loadCoinList() {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    coinList = res.data;
    console.log(`Loaded ${coinList.length} coins from CoinGecko`);
  } catch (err) {
    console.error('CoinGecko list load failed:', err.message);
  }
}

loadCoinList();

// Detect coin symbol or name in message
function extractCoinQuery(msg) {
  const cleaned = msg.toLowerCase().replace(/\b(today|now|currently|the|chart|price|marketcap|market cap|value)\b/g, '').trim();
  const words = cleaned.split(/\s+/);
  for (const word of words) {
    const match = coinList.find(c =>
      c.symbol === word || c.id === word || c.name.toLowerCase() === word
    );
    if (match) return match;
  }
  return null;
}

// Endpoints
app.get('/', (req, res) => res.send('CrimznBot v3: GPT + Live Crypto + TradingView Charts'));
app.get('/health', (req, res) => res.json({ status: 'Online with live charts & GPT' }));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const coinData = extractCoinQuery(userMessage);

  if (coinData) {
    try {
      const cg = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinData.id}`);
      const price = cg.data.market_data.current_price.usd;
      const marketCap = cg.data.market_data.market_cap.usd;

      const symbol = coinData.symbol.toUpperCase();
      const tradingViewLink = `https://www.tradingview.com/symbols/${symbol}USD`;

      return res.json({
        reply: `Live data for **${cg.data.name} (${symbol})**:\n- Price: $${price.toLocaleString()}\n- Market Cap: $${marketCap.toLocaleString()}\n- [View Chart on TradingView](${tradingViewLink})`
      });
    } catch {
      return res.json({ reply: `Couldn't fetch data for "${coinData.id}". Try again.` });
    }
  }

  // Fallback to GPT
  try {
    const gpt = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are CrimznBot, a crypto consultant and advisor.' },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 200
    });

    const reply = gpt.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('GPT error:', error.response?.data || error.message);
    res.status(500).json({ reply: 'CrimznBot failed to respond.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`CrimznBot running at http://0.0.0.0:${port}`);
});
