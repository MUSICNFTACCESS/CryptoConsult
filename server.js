import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
let usageCount = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const tokenAliases = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  avax: 'avalanche-2',
  sui: 'sui',
  link: 'chainlink',
  ondo: 'ondo-finance',
  pepe: 'pepe'
};

let coinListCache = [];

app.use(express.static(__dirname));
app.use(express.json());

const refreshCoinList = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
    coinListCache = await res.json();
    console.log('Coin list cache loaded.');
  } catch (e) {
    console.error('Error fetching coin list:', e.message);
  }
};
refreshCoinList();

app.post('/api/chat', async (req, res) => {
  usageCount++;
  const userMessage = req.body.message || '';
  const lower = userMessage.toLowerCase().replace(/[^\w\s]/g, '');
  console.log("User input:", lower);

  let reply = '';

  try {
    const match = lower.match(/(?:price of|what(?:s| is) the price of) (\w+)/);
    console.log("Match result:", match);

    if (match && match[1]) {
      const symbol = match[1].toLowerCase();
      let token = tokenAliases[symbol];

      if (!token && coinListCache.length > 0) {
        const found = coinListCache.find(c => c.symbol === symbol);
        if (found) token = found.id;
      }

      if (token) {
        const cgRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`);
        const data = await cgRes.json();
        console.log("CoinGecko response:", JSON.stringify(data));

        if (data[token] && data[token].usd) {
          reply = `The current price of ${symbol.toUpperCase()} is $${data[token].usd}`;
          return res.json({ reply });
        } else {
          reply = `I couldn't find the price for "${symbol.toUpperCase()}". Try another token.`;
          return res.json({ reply });
        }
      } else {
        reply = `Sorry, I couldn't identify the token "${symbol.toUpperCase()}".`;
        return res.json({ reply });
      }
    }
  } catch (e) {
    console.error("Token price logic failed:", e.message);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }]
    });
    reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    console.error("OpenAI call failed:", e.message);
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
