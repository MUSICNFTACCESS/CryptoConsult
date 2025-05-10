const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const pricesRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
    const pricesData = await pricesRes.json();
    const btc = pricesData.bitcoin.usd;
    const eth = pricesData.ethereum.usd;
    const sol = pricesData.solana.usd;

    const prompt = `BTC: $\{btc\} | ETH: $\{eth\} | SOL: $\{sol\}\n\nUser: ${userMessage}\nCrimznBot:`;

    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: 'You are CrimznBot, an expert in crypto consulting. Give sharp, practical advice.' }, { role: 'user', content: prompt }]
      })
    });

    const gptData = await gptRes.json();
    const reply = gptData.choices?.[0]?.message?.content || 'CrimznBot is currently unavailable.';

    res.json({ reply });
  } catch (err) {
    console.error('Bot error:', err);
    res.status(500).json({ reply: 'Error reaching server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
